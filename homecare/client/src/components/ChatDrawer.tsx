import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, Paperclip, Image as ImageIcon, Mic, Square,
  CheckCheck, Volume2, FileText, User, Loader2
} from 'lucide-react';
import { api } from '../context/AuthContext';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  receiverId?: string;
  receiverName?: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  bookingId,
  receiverId = 'caregiver',
  receiverName = 'Caregiver Support',
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [uploading, setUploading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load message history
  useEffect(() => {
    if (!isOpen || !bookingId) return;

    let isMounted = true;
    setLoading(true);

    api
      .get(`/chat/messages/${bookingId}`)
      .then((res) => {
        if (isMounted && res.data?.data?.messages) {
          setMessages(res.data.data.messages);
        }
      })
      .catch((err) => console.warn('Chat history fallback:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, bookingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          await handleSendAttachment(base64Audio, 'voice_note.webm', 'audio/webm', 'Voice Note');
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setRecording(true);
    } catch (err) {
      console.warn('Microphone access denied:', err);
      alert('Microphone access is required to record voice notes.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  // Attachment upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      await handleSendAttachment(base64, file.name, file.type, file.name);
      setUploading(false);
    };
  };

  const handleSendAttachment = async (
    fileData: string,
    fileName: string,
    fileType: string,
    caption: string
  ) => {
    try {
      const res = await api.post('/chat/attachment', { fileData, fileName, fileType });
      const { fileUrl, messageType } = res.data.data;

      const newMsg = {
        _id: String(Date.now()),
        bookingId,
        senderId: 'me',
        receiverId,
        content: caption,
        fileUrl,
        messageType,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error('Attachment upload failed:', err);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      _id: String(Date.now()),
      bookingId,
      senderId: 'me',
      receiverId,
      content: input.trim(),
      messageType: 'text',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-100"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">{receiverName}</p>
                <p className="text-[11px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Consultation
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-xs font-semibold">Loading history...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-3">
                  💬
                </div>
                <p className="font-bold text-slate-700 text-sm">No messages yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Send a text, voice note, or medical attachment to start chatting with your caregiver.
                </p>
              </div>
            ) : (
              messages.map((m, i) => {
                const isMe = m.senderId === 'me' || m.senderId?.role === 'patient';
                return (
                  <div key={m._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs text-xs leading-relaxed ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {/* Image attachment */}
                      {m.messageType === 'image' && m.fileUrl && (
                        <div className="mb-2 rounded-xl overflow-hidden border border-white/20">
                          <img src={m.fileUrl} alt="Attachment" className="max-h-48 w-full object-cover" />
                        </div>
                      )}

                      {/* Audio voice note attachment */}
                      {m.messageType === 'audio' && m.fileUrl && (
                        <div className="flex items-center gap-2 bg-black/10 rounded-xl p-2 mb-1">
                          <Volume2 className="w-4 h-4 shrink-0" />
                          <audio src={m.fileUrl} controls className="w-44 h-8" />
                        </div>
                      )}

                      {/* Document attachment */}
                      {m.messageType === 'file' && m.fileUrl && (
                        <a
                          href={m.fileUrl}
                          download
                          className="flex items-center gap-2 bg-black/10 rounded-xl p-2 mb-1 hover:underline"
                        >
                          <FileText className="w-4 h-4 shrink-0" />
                          <span className="truncate">{m.content}</span>
                        </a>
                      )}

                      <p>{m.content}</p>
                      <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                        {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMe && <CheckCheck className="w-3 h-3 text-blue-200" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Controls & Input */}
          <div className="p-3 bg-white border-t border-slate-100 space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,application/pdf,audio/*"
            />

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
                style={{ minHeight: 'unset', minWidth: 'unset' }}
                title="Attach image or document"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
              </button>

              {recording ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center animate-pulse shrink-0"
                  style={{ minHeight: 'unset', minWidth: 'unset' }}
                  title="Stop recording voice note"
                >
                  <Square className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
                  style={{ minHeight: 'unset', minWidth: 'unset' }}
                  title="Record voice note"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 transition-colors"
                style={{ fontSize: '15px', minHeight: 'unset' }}
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-md"
                style={{ minHeight: 'unset', minWidth: 'unset' }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ChatDrawer;
