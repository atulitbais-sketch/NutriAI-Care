import { useState } from "react";
import { 
  Upload as UploadIcon, 
  Image as ImageIcon, 
  Loader2, 
  X, 
  CheckCircle2,
  Camera,
  FileImage
} from "lucide-react";
import "./Upload.css";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    e.preventDefault();
    const selectedFile = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setMessage("");
      setMessageType("");
    } else if (selectedFile) {
      setMessage("Please select an image file.");
      setMessageType("error");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (preview) URL.revokeObjectURL(preview);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select or drop an image first.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("foodName", foodName.trim());
    formData.append("notes", notes.trim());

    try {
      // ← Replace this with your real backend API call later
      // Example:
      // const response = await fetch("/api/upload", { method: "POST", body: formData });
      // if (!response.ok) throw new Error("Upload failed");
      await new Promise(resolve => setTimeout(resolve, 1800)); // simulated delay
      
      setMessage("Food image uploaded successfully!");
      setMessageType("success");
      
      // Optional: reset form after successful upload
      // setFile(null);
      // setPreview(null);
      // setFoodName("");
      // setNotes("");
    } catch {
      // No 'error' variable → fixes the ESLint warning
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <div className="upload-header">
          <div className="upload-icon-wrapper">
            <Camera size={28} />
          </div>
          <h1>Upload Food Photo</h1>
          <p className="upload-subtitle">
            Take or drop a photo of your meal for analysis
          </p>
        </div>

        {/* Drag & Drop + Preview Area */}
        <div 
          className={`dropzone ${dragActive ? "drag-active" : ""} ${preview ? "has-preview" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!preview ? (
            <>
              <div className="dropzone-content">
                <div className="dropzone-icon">
                  <FileImage size={48} strokeWidth={1.4} />
                </div>
                <p className="dropzone-text">
                  <span className="font-semibold">Click to browse</span> or drag & drop
                </p>
                <p className="dropzone-hint">PNG, JPG, WEBP • Max 5MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="file-label">
                Select Image
              </label>
            </>
          ) : (
            <div className="preview-container">
              <img src={preview} alt="Food preview" className="preview-image" />
              <button 
                type="button" 
                onClick={removeFile}
                className="remove-btn"
                aria-label="Remove image"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="form-fields">
          <div className="input-group">
            <label htmlFor="foodName">Food Name (optional)</label>
            <input
              id="foodName"
              type="text"
              placeholder="e.g. Grilled chicken salad"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              placeholder="e.g. Homemade, no dressing, portion size medium"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Upload Button & Message */}
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className={`upload-btn ${loading ? "loading" : ""}`}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadIcon size={20} />
              <span>Analyze Meal</span>
            </>
          )}
        </button>

        {message && (
          <div className={`message-box ${messageType}`}>
            {messageType === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <X size={18} />
            )}
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}