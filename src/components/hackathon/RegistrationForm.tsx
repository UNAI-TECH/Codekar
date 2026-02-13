import { useState, Fragment } from "react";
import { X, Plus, Trash2, Users, User, Mail, Phone, Briefcase, Github, GraduationCap, CheckCircle, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase-client";
import emailjs from "@emailjs/browser";
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } from "@/lib/emailjs-config";
import { REGISTRATION_FEES, isZohoConfigured } from "@/lib/zoho-payment-config";
import { initiateZohoPayment, generateOrderId, type ZohoPaymentRequest } from "@/lib/zoho-payment-service";

interface TeamMember {
    id: string;
    name: string;
    email: string;
    collegeName: string;
    department: string;
    year: string;
    role: string;
    github?: string;
}

interface RegistrationFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export const RegistrationForm = ({ isOpen, onClose }: RegistrationFormProps) => {
    const [teamName, setTeamName] = useState("");
    const [projectIdea, setProjectIdea] = useState("");
    const [projectTrack, setProjectTrack] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [registrationType, setRegistrationType] = useState<'individual' | 'team'>('individual');
    const [transactionId, setTransactionId] = useState("");
    const [upiId, setUpiId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentError, setPaymentError] = useState<string>("");
    const [orderId, setOrderId] = useState<string>("");
    const [members, setMembers] = useState<TeamMember[]>([
        { id: "1", name: "", email: "", collegeName: "", department: "", year: "", role: "Leader" },
    ]);

    // Update members when registration type changes
    const handleRegistrationTypeChange = (type: 'individual' | 'team') => {
        setRegistrationType(type);
        if (type === 'individual') {
            // Keep only the first member (Leader)
            setMembers([members[0]]);
            setTeamName(""); // Clear team name if individual? Or keep it as "Individual"
        }
    };

    const addMember = () => {
        if (registrationType === 'team' && members.length < 4) {
            setMembers([
                ...members,
                { id: Math.random().toString(), name: "", email: "", collegeName: "", department: "", year: "", role: "Member" },
            ]);
        }
    };

    const removeMember = (id: string) => {
        if (members.length > 1) {
            setMembers(members.filter((m) => m.id !== id));
        }
    };

    const updateMember = (id: string, field: keyof TeamMember, value: string) => {
        setMembers(
            members.map((m) => (m.id === id ? { ...m, [field]: value } : m))
        );
    };

    // Handle Zoho Payment Initiation
    const handlePayment = async () => {
        // Validate form first
        if (!members[0].name || !members[0].email) {
            setPaymentError("Please fill in your name and email before proceeding to payment.");
            return;
        }

        if (!projectTrack || !projectTitle || !projectIdea) {
            setPaymentError("Please complete all project details before proceeding to payment.");
            return;
        }

        if (registrationType === 'team' && !teamName) {
            setPaymentError("Please enter a team name.");
            return;
        }

        setIsProcessingPayment(true);
        setPaymentError("");

        try {
            // Generate unique order ID
            const newOrderId = generateOrderId();
            setOrderId(newOrderId);

            const registrationFee = registrationType === 'individual'
                ? REGISTRATION_FEES.individual
                : REGISTRATION_FEES.team;

            // Prepare payment request
            const paymentRequest: ZohoPaymentRequest = {
                amount: registrationFee,
                customerName: members[0].name,
                customerEmail: members[0].email,
                customerPhone: members[0].name, // You might want to add a phone field
                orderId: newOrderId,
                description: `Codekar Registration - ${registrationType === 'team' ? teamName : 'Individual'}`,
                registrationType
            };

            // Initiate payment
            const response = await initiateZohoPayment(paymentRequest);

            if (response.success && response.paymentUrl) {
                // Store transaction ID for later verification
                setTransactionId(response.transactionId || newOrderId);

                // Redirect to Zoho payment gateway
                window.location.href = response.paymentUrl;
            } else {
                setPaymentError(response.error || "Failed to initiate payment. Please try again.");
            }
        } catch (error: any) {
            console.error("Payment initiation error:", error);
            setPaymentError(error.message || "An error occurred while initiating payment.");
        } finally {
            setIsProcessingPayment(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = {
            registrationType,
            teamName: registrationType === 'team' ? teamName : "Individual",
            projectTrack,
            projectTitle,
            projectIdea,
            members,
            submittedAt: new Date().toISOString(),
            amount: registrationType === 'individual' ? 1 : 1000,
            transactionId,
            upiId
        };


        try {
            // Insert data into Supabase
            const { error } = await supabase
                .from('registrations')
                .insert([
                    {
                        registration_type: formData.registrationType,
                        team_name: formData.teamName,
                        project_track: formData.projectTrack,
                        project_title: formData.projectTitle,
                        project_idea: formData.projectIdea,
                        members: formData.members,
                        amount: formData.amount,
                        transaction_id: formData.transactionId,
                        request_data: formData, // Optional: store full data for backup
                    },
                ]);

            if (error) {
                // Check if error is related to duplicate key violation (e.g. transaction_id if unique)
                if (error.code === '23505') { // Postgres unique violation code
                    alert("⚠️ DUPLICATE ENTRY DETECTED\n\n" +
                        "This transaction ID or team/email has already been registered.\n\n" +
                        "Please check your details or contact support.");
                    setIsSubmitting(false);
                    return;
                }
                throw error;
            }


            // If sheet submission successful, send confirmation email
            const templateParams = {
                to_name: members[0].name,
                to_email: members[0].email,
                team_name: registrationType === 'team' ? teamName : "Individual",
                message: `Application received for ${registrationType} registration. Amount Paid: ₹${formData.amount}. TxID: ${transactionId}`,
            };

            console.log("📨 Attempting to send email with params:", templateParams);

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY.trim()
            );

            console.log("Registration Data Submitted:", formData);
            setIsSuccess(true);
        } catch (error: any) {
            console.error("Error submitting form", error);

            if (error?.status === 422) {
                alert("❌ Email Error (422): Unable to send email. \nPossible causes:\n1. The 'to_email' field in your EmailJS template might not match the variable name in code.\n2. The email address provided is invalid.\n\nPlease check your EmailJS Template and ensure it uses {{to_name}}, {{to_email}}, {{team_name}}, and {{message}}.");
            } else if (error?.text?.includes("Public Key")) {
                alert("❌ Email Error: Invalid EmailJS Public Key. Please check 'src/lib/emailjs-config.ts' and update EMAILJS_PUBLIC_KEY from your dashboard.");
            } else {
                alert("❌ Registration Failed: " + (error?.text || error.message || "Unknown error occurred"));
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-sm overflow-y-auto"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-card border border-primary/20 rounded-xl shadow-2xl shadow-primary/10 overflow-hidden my-8">
                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4"
                                >
                                    <CheckCircle className="w-12 h-12 text-primary" />
                                </motion.div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold text-foreground">Registration Successful!</h2>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        You have successfully registered for Codekar. check your email for confirmation and further details.
                                    </p>
                                </div>

                                <Button
                                    onClick={onClose}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 rounded-lg shadow-lg shadow-primary/20 mt-6"
                                >
                                    Close
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-primary/10 bg-card/50">
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">
                                            Register for <span className="text-primary">Codekar</span>
                                        </h2>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            Join the innovation hackathon
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/10"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">

                                    {/* Registration Type Toggle */}
                                    <div className="flex p-1 bg-muted/20 rounded-lg border border-border/50">
                                        <button
                                            type="button"
                                            onClick={() => handleRegistrationTypeChange('individual')}
                                            className={cn(
                                                "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                                                registrationType === 'individual'
                                                    ? "bg-primary text-primary-foreground shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                            )}
                                        >
                                            Individual
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRegistrationTypeChange('team')}
                                            className={cn(
                                                "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                                                registrationType === 'team'
                                                    ? "bg-primary text-primary-foreground shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                            )}
                                        >
                                            Team
                                        </button>
                                    </div>

                                    {/* Project/Team Info */}
                                    <section className="space-y-4">
                                        <div className="flex items-center gap-2 text-primary mb-4">
                                            <Briefcase size={20} />
                                            <h3 className="font-semibold uppercase tracking-wider text-sm">
                                                {registrationType === 'team' ? "Team Details" : "Project Details"}
                                            </h3>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            {registrationType === 'team' && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-foreground">Team Name</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={teamName}
                                                        onChange={(e) => setTeamName(e.target.value)}
                                                        className="w-full bg-muted/10 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                                                        placeholder="Enter your team name..."
                                                    />
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">Project Track</label>
                                                <select
                                                    required
                                                    value={projectTrack}
                                                    onChange={(e) => setProjectTrack(e.target.value)}
                                                    className="w-full bg-muted/10 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                                                >
                                                    <option value="" disabled className="bg-zinc-900 text-white">Select a track</option>
                                                    <option value="Education" className="bg-zinc-900 text-white">Education</option>
                                                    <option value="Entertainment" className="bg-zinc-900 text-white">Entertainment</option>
                                                    <option value="AI agents and automation" className="bg-zinc-900 text-white">AI agents and automation</option>
                                                    <option value="Big Data and Mass Communication" className="bg-zinc-900 text-white">Big Data and Mass Communication</option>
                                                    <option value="Core AI & ML" className="bg-zinc-900 text-white">Core AI & ML</option>
                                                    <option value="Cutting Agents & Automation" className="bg-zinc-900 text-white">Cutting Agents & Automation</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">Project Title</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={projectTitle}
                                                    onChange={(e) => setProjectTitle(e.target.value)}
                                                    className="w-full bg-muted/10 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                                                    placeholder="Enter your project title..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Project Idea (Brief)</label>
                                            <textarea
                                                required
                                                value={projectIdea}
                                                onChange={(e) => setProjectIdea(e.target.value)}
                                                className="w-full bg-muted/10 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors min-h-[80px] placeholder:text-muted-foreground/50"
                                                placeholder="Describe what you plan to build..."
                                            />
                                        </div>
                                    </section>

                                    <div className="h-px bg-border" />

                                    {/* Members */}
                                    <section className="space-y-6">
                                        <div className="flex items-center justify-between text-primary mb-4">
                                            <div className="flex items-center gap-2">
                                                <Users size={20} />
                                                <h3 className="font-semibold uppercase tracking-wider text-sm">
                                                    {registrationType === 'team' ? "Team Members" : "Participant Details"}
                                                </h3>
                                            </div>
                                            {registrationType === 'team' && (
                                                <span className="text-xs text-muted-foreground bg-muted/20 px-3 py-1 rounded-full border border-border">
                                                    {members.length} / 4 Members
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            {members.map((member, index) => (
                                                <Fragment key={member.id}>
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="relative p-5 bg-card/50 border border-border rounded-xl hover:border-primary/30 transition-colors group"
                                                    >
                                                        {registrationType === 'team' && (
                                                            <div className="absolute top-4 right-4 text-xs font-mono text-primary/70">
                                                                {index === 0 ? "TEAM LEADER" : `MEMBER ${index + 1}`}
                                                            </div>
                                                        )}

                                                        <div className="grid md:grid-cols-2 gap-4 mt-2">
                                                            <div className="space-y-1">
                                                                <label className="text-xs text-muted-foreground">Full Name</label>
                                                                <div className="relative">
                                                                    <User className="absolute left-3 top-3 text-muted-foreground" size={16} />
                                                                    <input
                                                                        required
                                                                        type="text"
                                                                        value={member.name}
                                                                        onChange={(e) => updateMember(member.id, "name", e.target.value)}
                                                                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                                                                        placeholder="Enter your name..."
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-xs text-muted-foreground">Email Address</label>
                                                                <div className="relative">
                                                                    <Mail className="absolute left-3 top-3 text-muted-foreground" size={16} />
                                                                    <input
                                                                        required
                                                                        type="email"
                                                                        value={member.email}
                                                                        onChange={(e) => updateMember(member.id, "email", e.target.value)}
                                                                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                                                                        placeholder="Enter your email..."
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid md:grid-cols-3 gap-4 mt-3">
                                                            <div className="space-y-1">
                                                                <label className="text-xs text-muted-foreground">College Name</label>
                                                                <div className="relative">
                                                                    <GraduationCap className="absolute left-3 top-3 text-muted-foreground" size={16} />
                                                                    <input
                                                                        required
                                                                        type="text"
                                                                        value={member.collegeName}
                                                                        onChange={(e) => updateMember(member.id, "collegeName", e.target.value)}
                                                                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                                                                        placeholder="Your college..."
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-xs text-muted-foreground">Department</label>
                                                                <div className="relative">
                                                                    <Briefcase className="absolute left-3 top-3 text-muted-foreground" size={16} />
                                                                    <input
                                                                        required
                                                                        type="text"
                                                                        value={member.department}
                                                                        onChange={(e) => updateMember(member.id, "department", e.target.value)}
                                                                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                                                                        placeholder="Your department..."
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-xs text-muted-foreground">Year</label>
                                                                <select
                                                                    required
                                                                    value={member.year}
                                                                    onChange={(e) => updateMember(member.id, "year", e.target.value)}
                                                                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                                                                >
                                                                    <option value="" disabled className="bg-zinc-900">Select</option>
                                                                    <option value="1st Year" className="bg-zinc-900">1st Year</option>
                                                                    <option value="2nd Year" className="bg-zinc-900">2nd Year</option>
                                                                    <option value="3rd Year" className="bg-zinc-900">3rd Year</option>
                                                                    <option value="4th Year" className="bg-zinc-900">4th Year</option>                                                                </select>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                    {/* The remove button should be outside the motion.div but still within the Fragment for positioning */}
                                                    {registrationType === 'team' && index !== 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeMember(member.id)}
                                                            className="absolute -right-2 -top-2 p-1.5 bg-[#ef4444] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </Fragment>
                                            ))}
                                        </div>

                                        {registrationType === 'team' && members.length < 4 && (
                                            <button
                                                type="button"
                                                onClick={addMember}
                                                className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-medium"
                                            >
                                                <Plus size={18} />
                                                Add Team Member
                                            </button>
                                        )}
                                    </section>

                                    <div className="h-px bg-border" />

                                    {/* Payment Section - Zoho Gateway */}
                                    <section className="space-y-4">
                                        <div className="flex items-center gap-2 text-primary mb-4">
                                            <CreditCard size={20} />
                                            <h3 className="font-semibold uppercase tracking-wider text-sm">
                                                Payment
                                            </h3>
                                        </div>

                                        {!isZohoConfigured() ? (
                                            // Show message when Zoho is not configured
                                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                                                <div className="flex items-start gap-3">
                                                    <AlertCircle className="text-yellow-400 mt-0.5 flex-shrink-0" size={20} />
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-medium text-yellow-400">
                                                            Payment Gateway Configuration Pending
                                                        </p>
                                                        <p className="text-xs text-yellow-400/80">
                                                            The Zoho payment gateway is currently being set up.
                                                            Please check back soon or contact support for alternative payment methods.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // Show payment details when Zoho is configured
                                            <>
                                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Registration Fee</p>
                                                            <p className="text-3xl font-bold text-primary">
                                                                ₹{registrationType === 'individual'
                                                                    ? REGISTRATION_FEES.individual
                                                                    : REGISTRATION_FEES.team}
                                                            </p>
                                                        </div>
                                                        <div className="p-3 bg-primary/10 rounded-lg">
                                                            <CreditCard className="text-primary" size={32} />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 text-sm text-muted-foreground">
                                                        <p>✓ Secure payment via Zoho Payment Gateway</p>
                                                        <p>✓ Instant confirmation email</p>
                                                        <p>✓ UPI, Cards, Net Banking accepted</p>
                                                    </div>
                                                </div>

                                                {paymentError && (
                                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                                        <div className="flex items-start gap-2">
                                                            <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={16} />
                                                            <p className="text-sm text-red-400">{paymentError}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </section>

                                    {/* Submit / Pay Button */}
                                    <div className="pt-4 border-t border-border">
                                        <Button
                                            type="button"
                                            onClick={handlePayment}
                                            disabled={isProcessingPayment || !isZohoConfigured()}
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6 rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isProcessingPayment ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="animate-spin">⏳</span> Processing...
                                                </span>
                                            ) : !isZohoConfigured() ? (
                                                "Payment Gateway Not Configured"
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <CreditCard size={20} />
                                                    Proceed to Payment - ₹{registrationType === 'individual'
                                                        ? REGISTRATION_FEES.individual
                                                        : REGISTRATION_FEES.team}
                                                </span>
                                            )}
                                        </Button>
                                        <p className="text-center text-muted-foreground text-xs mt-3">
                                            By proceeding, you agree to our Code of Conduct and Terms.
                                        </p>
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}

        </AnimatePresence>
    );
};
