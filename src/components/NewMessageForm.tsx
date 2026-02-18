"use client";

import { useState } from "react";
import { sendMessage } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";

export default function NewMessageForm({
  partnerName,
}: {
  partnerName?: string;
}) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const MAX_LENGTH = 500;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    setError("");

    let imageUrl: string | undefined;

    if (image) {
      const supabase = createClient();
      const filename = `${Date.now()}-${image.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from("message-images")
        .upload(filename, image);

      if (uploadError) {
        setError("Image upload failed: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("message-images")
        .getPublicUrl(data.path);

      imageUrl = urlData.publicUrl;
    }

    const result = await sendMessage(message, imageUrl);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="glass-card p-8 animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">♡</div>
          <h1 className="font-display text-3xl font-medium text-[#3d2f22] mb-2">
            A new reason
          </h1>
          {partnerName && (
            <p className="font-serif italic text-[#7a6658]">
              for {partnerName}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <span className="absolute top-3 left-4 font-display text-4xl leading-none text-[#e8c8b8] pointer-events-none select-none">
              "
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={MAX_LENGTH}
              rows={6}
              className="glass-input w-full px-5 pt-8 pb-4 rounded-2xl text-[#3d2f22] placeholder-[#c8b8a8] font-serif text-base leading-relaxed resize-none"
              placeholder="Tell them something beautiful..."
              required
              autoFocus
            />
            <div className="absolute bottom-3 right-4 text-xs text-[#c8b8a8] font-sans">
              {message.length}/{MAX_LENGTH}
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-[#7a6658] mb-2">
              Attach an image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-[#7a6658] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[#fce8e4] file:text-[#c85540] hover:file:bg-[#f8d0c8] cursor-pointer"
            />
            {preview && (
              <div className="mt-3 relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 rounded-xl object-cover border border-[#e8d0c0]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#c85540] text-white rounded-full text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Prompt suggestions */}
          <div className="flex flex-wrap gap-2">
            {[
              "I love the way you...",
              "You make me feel...",
              "My favourite memory of us...",
              "Because of you...",
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setMessage(prompt)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#e8d0c0] text-[#a89888] hover:bg-white/60 hover:text-[#7a6658] transition-all duration-200 font-sans"
              >
                {prompt}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50/80 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl font-sans">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <a
              href="/home"
              className="btn-ghost flex-1 py-3.5 rounded-xl text-sm font-medium text-center transition-all duration-200"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="btn-primary flex-[2] py-3.5 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner w-4 h-4" />
                  Sending...
                </>
              ) : (
                <>
                  <span>Send with love</span>
                  <span>♡</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
