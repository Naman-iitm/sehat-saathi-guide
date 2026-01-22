import { HelpCategory, HelpArticle } from '../types/help';

export const helpCategories: HelpCategory[] = [
    {
        id: 'getting-started',
        name: 'Getting Started',
        icon: 'Rocket',
        description: 'Learn the basics of using Sehat Saathi Guide.'
    },
    {
        id: 'account',
        name: 'Account & Security',
        icon: 'User',
        description: 'Manage your profile, password, and privacy settings.'
    },
    {
        id: 'medicine-store',
        name: 'Medicine Store',
        icon: 'Pill',
        description: 'Information about orders, payments, and delivery.'
    },
    {
        id: 'lab-tests',
        name: 'Lab Tests',
        icon: 'Activity',
        description: 'How to book and manage your lab test appointments.'
    },
    {
        id: 'troubleshooting',
        name: 'Troubleshooting',
        icon: 'AlertCircle',
        description: 'Fix common issues and technical problems.'
    }
];

export const helpArticles: HelpArticle[] = [
    {
        id: 'how-to-order-medicine',
        title: 'How to Order Medicine',
        categoryId: 'medicine-store',
        lastUpdated: '2026-01-20',
        isPopular: true,
        tags: ['order', 'medicine', 'purchase'],
        content: `
# How to Order Medicine

Ordering medicines on Sehat Saathi Guide is simple and secure. Follow these steps to get your medications delivered to your doorstep.

## Steps to Order:
1. **Browse or Search:** Go to the "Medicine Store" from the navigation menu. Use the search bar or browse by categories to find the items you need.
2. **Add to Cart:** Once you find a medicine, click the "Add to Cart" button. You can adjust the quantity as needed.
3. **Review Cart:** Click on the cart icon to see your selected items. Ensure everything is correct.
4. **Checkout:** Click "Checkout" and provide your delivery address.
5. **Payment:** Choose your preferred payment method and complete the transaction.
6. **Order Confirmation:** You will receive a confirmation message and can track your order in the "Order Tracking" section.

> [!NOTE]
> Some prescription medicines may require you to upload a valid prescription before the order is processed.
    `
    },
    {
        id: 'tracking-your-order',
        title: 'Tracking Your Order',
        categoryId: 'medicine-store',
        lastUpdated: '2026-01-19',
        tags: ['track', 'order', 'status'],
        content: `
# Tracking Your Order

Stay updated on your medicine delivery status with our real-time tracking feature.

## How to Track:
1. Go to your **Profile** page.
2. Click on **Order Tracking**.
3. Here you can see a list of all your active and past orders.
4. Click on a specific order to see its current status (e.g., Placed, Dispatched, Out for Delivery).

If you encounter any delays, feel free to contact our support team thrugh the Contact Us page.
    `
    },
    {
        id: 'booking-lab-test',
        title: 'Booking a Lab Test',
        categoryId: 'lab-tests',
        lastUpdated: '2026-01-18',
        isPopular: true,
        tags: ['lab', 'test', 'booking'],
        content: `
# Booking a Lab Test

We offer a wide range of lab tests with home sample collection options.

## How to Book:
1. Navigate to **Lab Tests** from the main menu.
2. Search for the test you need or browse the available packages.
3. Click on **View Details** to learn about the test requirements (e.g., fasting).
4. Click **Book Now**.
5. Select a date and time slot that works for you.
6. Provide the patient details and sample collection address.
7. Confirm the booking and pay.

You will receive a notification once your sample is collected and when your results are ready.
    `
    },
    {
        id: 'resetting-password',
        title: 'Resetting Your Password',
        categoryId: 'account',
        lastUpdated: '2026-01-15',
        tags: ['password', 'reset', 'security'],
        content: `
# Resetting Your Password

If you've forgotten your password or want to update it for security reasons, follow these steps.

## If you are logged in:
1. Go to your **Profile**.
2. Click on **Edit Profile**.
3. Look for the "Security" or "Change Password" section.
4. Enter your current password and your new password twice.

## If you forgot your password:
1. Go to the **Login** page.
2. Click on the "Forgot Password?" link.
3. Enter your registered email address.
4. Check your inbox for a reset link and follow the instructions.
    `
    },
    {
        id: 'getting-started-guide',
        title: 'Welcome to Sehat Saathi Guide',
        categoryId: 'getting-started',
        lastUpdated: '2026-01-20',
        isPopular: true,
        tags: ['welcome', 'guide', 'basics'],
        content: `
# Welcome to Sehat Saathi Guide

Sehat Saathi Guide is your all-in-one health companion. Here is a quick tour of what you can do:

- **Symptom Tracker:** Use our AI-powered tool to check your symptoms and get guidance.
- **Medicine Store:** Access a wide range of medicines and healthcare products.
- **Lab Tests:** Book home collection for diagnostic tests.
- **AI Assistant:** Get instant health tips and answers to your queries.
- **Sarkari Yojana:** Explore government health schemes you might be eligible for.

We are here to help you manage your health journey more effectively!
    `
    }
];
