#!/bin/bash

# Test Google Apps Script Endpoint
# This script tests if your Google Apps Script is working correctly

SCRIPT_URL="https://script.google.com/macros/s/AKfycbwj56y67AZxx6Hogm7AJdAXRa1pZ9Wz8Y3x9mlcdthV1yvDikywbmsywj1WYyuwk0X9/exec"

echo "================================================"
echo "Testing Google Apps Script for Registration Form"
echo "================================================"
echo ""

# Test 1: Individual Registration
echo "📝 Test 1: Individual Registration"
echo "-----------------------------------"

INDIVIDUAL_DATA='{
  "registrationType": "individual",
  "teamName": "Individual",
  "projectTrack": "ai",
  "projectIdea": "Test AI project from Linux terminal",
  "members": [
    {
      "id": "1",
      "name": "Test User",
      "email": "testuser@example.com",
      "role": "Leader"
    }
  ],
  "submittedAt": "'$(date -Iseconds)'",
  "amount": 1,
  "transactionId": "TEST'$(date +%s)'",
  "upiId": "testuser@upi"
}'

echo "Sending Individual registration..."
RESPONSE=$(curl -s -L -X POST "$SCRIPT_URL" \
  -H "Content-Type: application/json" \
  -d "$INDIVIDUAL_DATA")

echo "Response: $RESPONSE"
echo ""

# Check if successful
if echo "$RESPONSE" | grep -q '"result":"success"'; then
  echo "✅ Individual registration SUCCESSFUL!"
else
  echo "❌ Individual registration FAILED!"
  echo "Response details: $RESPONSE"
fi

echo ""
echo "================================================"
echo ""

# Test 2: Team Registration
echo "📝 Test 2: Team Registration"
echo "-----------------------------------"

TEAM_DATA='{
  "registrationType": "team",
  "teamName": "Linux Test Team",
  "projectTrack": "web3",
  "projectIdea": "Test blockchain project from Linux terminal",
  "members": [
    {
      "id": "1",
      "name": "Team Leader",
      "email": "leader@example.com",
      "role": "Leader",
      "github": "https://github.com/leader"
    },
    {
      "id": "2",
      "name": "Team Member 2",
      "email": "member2@example.com",
      "role": "Member"
    }
  ],
  "submittedAt": "'$(date -Iseconds)'",
  "amount": 1000,
  "transactionId": "TEAM'$(date +%s)'",
  "upiId": "teamleader@upi"
}'

echo "Sending Team registration..."
RESPONSE=$(curl -s -L -X POST "$SCRIPT_URL" \
  -H "Content-Type: application/json" \
  -d "$TEAM_DATA")

echo "Response: $RESPONSE"
echo ""

# Check if successful
if echo "$RESPONSE" | grep -q '"result":"success"'; then
  echo "✅ Team registration SUCCESSFUL!"
else
  echo "❌ Team registration FAILED!"
  echo "Response details: $RESPONSE"
fi

echo ""
echo "================================================"
echo ""
echo "🔍 Next Steps:"
echo "1. Check your Google Sheet to verify the data was added:"
echo "   https://docs.google.com/spreadsheets/d/1FcovU6NBLez4mKKxT0_LCxISIHs94EFVsCa0Ccu20k0/edit"
echo ""
echo "2. You should see two new tabs:"
echo "   - Individual_Registrations (with 1 test entry)"
echo "   - Team_Registrations (with 1 test entry)"
echo ""
echo "3. If you see errors, follow the instructions in:"
echo "   SPREADSHEET_SETUP.md to update your Apps Script code"
echo "================================================"
