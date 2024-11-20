# JSON Editor

## Project Overview

JSON Editor is a web-based JSON file editor designed to provide a user-friendly interface for viewing and editing JSON data. The currently implemented features include:

- File Upload: Supports drag-and-drop and click-to-upload for JSON files.
- JSON Editing: Provides an intuitive interface for editing JSON data.
- Data Preview: Preview edited JSON data in a dialog.
- Data Export: Export edited JSON data as a file.

## Building and Running the Project

### Running Locally

1. Clone the project to your local machine:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run serve
   ```

4. Open `http://localhost:8080` in your browser to view the project.

### Using Docker Image

1. Build the Docker image:

   ```bash
   docker build -t json-editor .
   ```

2. Run the Docker container:

   ```bash
   docker run -d -p 8080:80 json-editor
   ```

3. Open `http://localhost:8080` in your browser to use the JSON Editor.

## Usage Instructions

- Upload JSON File: Click the upload area or drag and drop files into the upload area.
- Edit JSON Data: Directly modify data in the editor.
- Preview JSON Data: Click the "Preview" button to view the edited data.
- Export JSON Data: Click the "Export" button to download the edited JSON file.