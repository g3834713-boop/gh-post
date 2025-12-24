# Quick Start: Tracking System Usage

## For Customers - How to Track Your Package

### Step 1: Access the Tracking Page
- Go to https://gh-post-app.vercel.app
- Click the "Track Package" button on the homepage

### Step 2: Enter Your Tracking Number
- Your tracking number has the format: **GH-PKG-YYYY-XXXXXX**
- Example: `GH-PKG-2024-001234`
- Type the number and click "Track Package"

### Step 3: Wait for Loading (7 seconds)
- A loading bar will appear and fill over 7 seconds
- This indicates the system is fetching your package information
- Progress percentage is displayed

### Step 4: View Your Shipment Status
Once loading completes, you'll see:

1. **Your Tracking Number** - Displayed at the top
2. **Full Route Map** - Shows all 9 locations from China to Ghana:
   - ✅ **Completed (Blue)** - Locations your package has already passed
   - ⏳ **Pending (Gray)** - Locations your package still needs to reach

3. **Current Status Banner** - Shows:
   - 📦 Current location
   - Status message
   - Estimated delivery date

4. **Route Details** - Each location shows:
   - Location name
   - Country
   - Stage of delivery process

### Example Tracking Route
```
✅ Shenzhen, China - Order Processing & Packing
✅ Shanghai Port, China - Port of Departure
✅ South China Sea - In Transit
⏳ Suez Canal, Egypt - Port Transit
⏳ Arabian Sea - In Transit
⏳ Tema Port, Ghana - Port of Arrival
⏳ Accra Customs, Ghana - Customs Clearance
⏳ Ghana Post Hub, Ghana - Sorting & Distribution
⏳ Local Delivery Station, Ghana - Ready for Delivery
```

### Need Help?
- Contact Ghana Post Customer Service: **+233 (0) 800 800 800**
- If you don't have a tracking number, contact the shipper
- All tracking information is updated by Ghana Post staff

---

## For Admins - How to Manage Tracking Codes

### Step 1: Log In to Admin Dashboard
- Go to https://gh-post-app.vercel.app/admin
- **Username:** `admin`
- **Password:** `ghanapost2024`
- Click "Login"

### Step 2: Navigate to Tracking Management
- In the Admin Dashboard, you'll see two tabs:
  - 📋 Submissions (existing data)
  - 📦 **Tracking Management** ← Click this

### Step 3: Generate a New Tracking Code

**To create a tracking code for a new shipment:**

1. Fill in the "Generate New Tracking Code" form:
   - **Description:** Enter product details (e.g., "Electronics shipment from Shenzhen")
   - **Starting Location:** Select where the package currently is from the dropdown

2. Click **"+ Generate Tracking Code"**

3. A unique code will be created automatically:
   - Format: `GH-PKG-YYYY-XXXXXX`
   - Example: `GH-PKG-2024-123456`

4. You'll see a success message: "✓ Tracking code generated successfully!"

5. The code immediately appears in the "Active Tracking Codes" section below

### Step 4: Update Package Location

**As the package moves through the route, update its location:**

1. In the "Active Tracking Codes" section, find the code to update
2. Click the **"Update"** button on that code's card
3. In the modal that opens:
   - Select the **new current location** from the dropdown
   - The dropdown shows all 9 route waypoints in order
4. Click **"Update Location"**
5. You'll see: "✓ Location updated successfully!"
6. The tracking card immediately reflects the new location

### Step 5: View All Tracking Codes

All active tracking codes are displayed in the grid below the generation form:

Each card shows:
- ✓ Tracking code number (blue, clickable)
- Description (product details)
- Current location
- Current status
- Estimated delivery date
- "Update" button to modify location
- Ability to delete if needed

### Step 6: Delete a Tracking Code (if needed)

1. Click **"Update"** on the code card
2. In the modal, click **"Delete"** button (orange)
3. Confirm deletion when prompted
4. The code will be removed from the system

---

## Complete Route Locations (for admin reference)

When updating location, you can select from these 9 waypoints in order:

| # | Location | Country | Description |
|---|----------|---------|-------------|
| 1 | Shenzhen, China | China | Order Processing & Packing |
| 2 | Shanghai Port, China | China | Port of Departure |
| 3 | South China Sea | N/A | In Transit |
| 4 | Suez Canal, Egypt | Egypt | Port Transit |
| 5 | Arabian Sea | N/A | In Transit |
| 6 | Tema Port, Ghana | Ghana | Port of Arrival |
| 7 | Accra Customs, Ghana | Ghana | Customs Clearance |
| 8 | Ghana Post Hub, Ghana | Ghana | Sorting & Distribution |
| 9 | Local Delivery Station, Ghana | Ghana | Ready for Delivery |

---

## Example Workflow

### Scenario: Electronics Order from China

**Day 1 - Order Placed:**
1. Admin generates tracking code: `GH-PKG-2024-501234`
2. Description: "MacBook Pro Laptop"
3. Starting location: "Shenzhen, China"
4. Code is active and ready for customer

**Day 3 - At Port:**
1. Admin updates location to: "Shanghai Port, China"
2. Customer can now see: Package at Shanghai Port, 1/9 locations complete

**Day 7 - At Sea:**
1. Admin updates location to: "South China Sea"
2. Customer sees progress indicator at 3/9 locations

**Day 20 - Arriving in Ghana:**
1. Admin updates location to: "Tema Port, Ghana"
2. Customer sees significant progress (6/9 locations)

**Day 22 - In Ghana Customs:**
1. Admin updates location to: "Accra Customs, Ghana"
2. Customer can plan for delivery

**Day 24 - Out for Delivery:**
1. Admin updates location to: "Local Delivery Station, Ghana"
2. Customer knows delivery is imminent

**Day 25 - Delivered:**
1. Customer can visit Local Delivery Station to pick up
2. Admin can delete the code or mark as completed

---

## Tips & Best Practices

✅ **DO:**
- Generate codes for all incoming shipments
- Update location regularly as package moves
- Use descriptive product names in the description field
- Provide customers with the complete tracking code

❌ **DON'T:**
- Share your admin password
- Generate duplicate codes for the same shipment
- Leave packages in "Shenzhen" indefinitely
- Delete codes without confirming they're not in use

---

## Troubleshooting

### Customer Issue: "Invalid format. Use format GH-PKG-YYYY-XXXXXX"
**Solution:** Make sure the tracking code follows the exact format with dashes in the right places

### Customer Issue: "Tracking code not found"
**Solution:** Ask the shipper for the correct code - it may have been generated incorrectly or not yet generated

### Admin Issue: Can't log in
**Solution:** 
- Username is exactly: `admin` (case-sensitive)
- Password is exactly: `ghanapost2024` (case-sensitive)

### Admin Issue: Location dropdown is empty
**Solution:** Refresh the page - the route locations load from the database automatically

### Admin Issue: Code not appearing after generation
**Solution:** 
- Check the success message appeared
- Scroll down in the "Active Tracking Codes" section
- If still missing, try refreshing the page

---

## Support

For technical issues, system errors, or questions:
1. Check that your internet connection is stable
2. Try refreshing the page
3. Clear browser cache and try again
4. Contact system administrator if problems persist

**Backend API Status:** https://gh-post.onrender.com (check here if tracking features don't work)
**Frontend Status:** https://gh-post-app.vercel.app (check here for UI issues)

---

**System Version:** 1.0 - Complete Tracking Implementation
**Last Updated:** Latest deployment
**Status:** ✅ Fully Operational
