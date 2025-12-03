# Google Play Store - Photo and Video Permissions Justification

## Issue
Google Play Store is requesting justification for photo and video permissions because they need to be directly related to your app's core purpose.

## Permissions Used and Justifications

### 1. CAMERA Permission
**Why it's needed:**
- Users can take photos directly from within the app to attach to CRM records (contacts, accounts, deals, etc.)
- This is a core CRM feature for documenting customer interactions, product photos, receipts, contracts, and other business documents
- The camera is accessed only when the user explicitly chooses to take a photo (not automatically)

**Justification Text for Play Console:**
```
Our CRM app requires camera access to allow users to take photos and attach them directly to customer records, deals, and other business documents. This is a core feature of our Customer Relationship Management system, enabling users to:
- Capture photos of products, receipts, contracts, and business cards
- Document customer interactions with visual evidence
- Attach photos to records for better record-keeping and collaboration

The camera is only accessed when users explicitly choose to take a photo through our in-app camera interface. We do not access the camera automatically or in the background.
```

### 2. READ_MEDIA_IMAGES / READ_EXTERNAL_STORAGE Permissions
**Why it's needed:**
- Users can select existing photos from their gallery to attach to CRM records
- This allows users to attach photos they've already taken or received
- Essential for importing business documents, product images, and other media into CRM records

**Justification Text for Play Console:**
```
Our CRM app requires access to photos from the device gallery to allow users to attach existing images to customer records, deals, and business documents. This is a core CRM feature that enables:
- Attaching product photos, receipts, contracts, and business cards from the device gallery
- Importing images received via email or messaging apps into CRM records
- Better documentation and collaboration through visual attachments

We only access photos when users explicitly choose to select images from their gallery through our in-app image picker. We do not access photos automatically or scan the entire gallery.
```

### 3. ACCESS_MEDIA_LOCATION Permission
**Why it's needed:**
- The app accesses EXIF metadata from photos (including location data) when users attach photos to records
- This is used to preserve photo metadata and potentially enable location-based features in the CRM
- The app uses `includeExif: true` in the image picker configuration

**Justification Text for Play Console:**
```
Our CRM app accesses location metadata from photos (EXIF data) when users attach photos to records. This enables:
- Preserving photo metadata for better record-keeping
- Potential location-based CRM features (e.g., associating customer visits with locations)
- Maintaining complete document information when photos are attached to records

Location metadata is only accessed from photos that users explicitly choose to attach to CRM records. We do not access location data from photos that are not selected by the user.
```

## How to Submit in Google Play Console

1. Go to your app in Google Play Console
2. Navigate to **Policy** → **App content** → **Sensitive permissions and APIs**
3. Find the **Photo and Video** permissions section
4. Click **Provide justification** or **Edit**
5. Copy and paste the justification texts above (or adapt them to your specific use case)
6. Make sure to emphasize that:
   - These are **core CRM features** (not optional)
   - Permissions are only used when **users explicitly choose** to take/select photos
   - The app does **not access media automatically** or in the background
   - All photo access is **directly related to attaching media to business records**

## Additional Tips

- **Be specific**: Mention specific use cases (attaching photos to customer records, deals, etc.)
- **Emphasize user control**: Make it clear users explicitly choose when to use these features
- **Link to core functionality**: Connect permissions to essential CRM features
- **Show screenshots**: If possible, provide screenshots showing the photo attachment feature in your app

## Technical Details

The app uses:
- `react-native-image-crop-picker` library for camera and gallery access
- Camera access: `ImageCropPicker.openCamera()` - only called when user taps camera button
- Gallery access: `ImageCropPicker.openPicker()` - only called when user taps gallery button
- EXIF data: `includeExif: true` - preserves metadata from selected photos

All permissions are declared in `android/app/src/main/AndroidManifest.xml` with proper version-specific declarations.



