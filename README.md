# TOI TCTC — Environmental Awareness Registration Portal

A modern, premium, mobile-responsive registration landing page for the **TOI TCTC Environmental Awareness Campaign**.

Built with **HTML5**, **CSS3**, and **vanilla JavaScript** — no frameworks, no build step, GitHub Pages ready.

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Professional Landing Page | ✅ |
| Built-in Registration Form | ✅ |
| Google Apps Script Integration | ✅ |
| Google Sheet Data Storage | ✅ |
| Auto Fake Email Generation | ✅ |
| Auto Fake Password Generation | ✅ |
| Glassmorphism UI | ✅ |
| Gradient Background | ✅ |
| Particle Animation | ✅ |
| Scroll Reveal Animations | ✅ |
| Mobile Responsive | ✅ |
| Preloader Animation | ✅ |
| Success Confetti Effect | ✅ |
| SEO Optimized | ✅ |
| Fast Loading | ✅ |
| Clean, Commented Code | ✅ |
| GitHub Pages Ready | ✅ |

---

## 📁 Folder Structure

```
project/
│
├── index.html            Landing page (full registration form built-in)
├── style.css             All styling (design tokens + glassmorphism + animations)
├── script.js             Form logic, validation, fake email/password, particles
│
├── assets/
│   ├── favicon.svg       Favicon
│
├── screenshots/          (add screenshots for documentation)
│
└── README.md             This file
```

---

## 🚀 Quick Setup

### Step 1: Create Google Sheet + Apps Script

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it **"TOI TCTC Registrations"**
3. In Row 1, add these headers:

   | A | B | C | D | E | F | G | H | I |
   |---|---|---|---|---|---|---|---|---|
   | Timestamp | First Name | Last Name | Email | Phone | City | Interest | Message | Generated Password |

4. Go to **Extensions → Apps Script**
5. Delete any existing code and paste the following:

```javascript
// ==========================================
// Google Apps Script — TOI TCTC Registration
// Paste this in Extensions > Apps Script
// ==========================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Append row with all data including generated email & password
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.firstName || "",
      data.lastName || "",
      data.generatedEmail || data.email || "",
      data.phone || "",
      data.city || "",
      data.interest || "",
      data.message || "",
      data.generatedPassword || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: handle GET requests for testing
function doGet(e) {
  return ContentService
    .createTextOutput("TOI TCTC Registration API is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

6. Click **Deploy → New deployment**
7. Select type: **Web app**
8. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
9. Click **Deploy** and copy the **Web App URL**

### Step 2: Configure the Website

Open `script.js` and paste your Web App URL:

```javascript
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

That's it! The form will now submit directly to your Google Sheet.

### Step 3: Preview Locally

No build tools needed — just open `index.html` in a browser, or serve locally:

```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

---

## 🔧 How It Works

### Registration Flow

1. User fills in the form on the website (name, phone, city, interest)
2. **If user skips email** → a fake email is auto-generated (e.g., `rahul845@gmail.com`)
3. **A fake password** is auto-generated (e.g., `Rahul@8452`)
4. Data is sent to Google Apps Script → stored in Google Sheet
5. Success overlay appears with confetti 🎉
6. User clicks **"Continue to TCTC"** → redirects to `https://toitctc.com`

### Fake Email Format
```
{firstname}{random 3-digit}@gmail.com
Examples: rahul845@gmail.com, atul203@gmail.com, student542@gmail.com
```

### Fake Password Format
```
{Firstname}@{random 4-digit}
Examples: Rahul@8452, Atul@9043, User@6521
```

### Fallback Mode

If `APPS_SCRIPT_URL` is left empty, clicking "Register Now" will:
1. Open the Google Form (`https://forms.gle/agLQWkGrm4EgQibD7`) in a new tab
2. Show the success overlay with the "Continue to TCTC" button

---

## 🌐 Deploy to GitHub Pages

1. Create a GitHub repo and push:

```bash
git init
git add .
git commit -m "Initial commit: TOI TCTC Registration Portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

2. Go to **Settings → Pages**
3. Set **Source**: Deploy from branch `main`, folder `/ (root)`
4. Save — your site will be live at:

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

---

## 🎨 Design Notes

- **Palette:** Deep emerald to teal gradients with warm amber/gold accents
- **Typography:** Outfit (display headings) + Inter (body/UI) from Google Fonts
- **Effects:** Glassmorphism cards, floating particles, scroll-reveal animations, confetti
- **Motion:** All animations respect `prefers-reduced-motion: reduce`
- **Performance:** Zero image dependencies — uses CSS gradients, SVG icons, and canvas

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| > 980px | 4-column card grid, side-by-side form |
| 768-980px | 2-column cards, stacked form |
| < 768px | Single column, mobile nav |
| < 480px | Compact typography and spacing |

---

## 🔒 Google Sheet Formulas (Optional)

If you want to auto-generate emails and passwords **directly in Google Sheets** instead of from the website, add these formulas:

### Auto Email (Column J):
```
=IF(D2="", LOWER(B2) & RANDBETWEEN(100,999) & "@gmail.com", D2)
```

### Auto Password (Column K):
```
=PROPER(B2) & "@" & RANDBETWEEN(1000,9999)
```

> **Note:** These formulas are optional. The website already generates and sends fake emails/passwords automatically.

---

## 📄 License

This project is free to use for the TOI TCTC Environmental Awareness Campaign.
No tracking, no analytics, no third-party scripts beyond Google Fonts.
