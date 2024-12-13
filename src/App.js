import React, { useState } from "react";
import "./styles.css";

//proccesses
const AudioFeedback = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [error, setError] = useState(null);
  const [recordingCompleted, setRecordingCompleted] = useState(false);

  //ses kaydı başlar
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const audioChunks = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        setAudioBlob(audioBlob);
        setRecordingCompleted(true);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Mikrofon erişimi reddedildi veya bir hata oluştu.");
    }
  };

  //ses kaydını durdurur
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const sendFeedback = async () => {
    if (!audioBlob) {
      alert("Kaydedilecek bir ses yok!");
      return;
    }

    //ses dosyasının kaydedilme formatını ayarlar
    const formData = new FormData();
    formData.append("audio", audioBlob, "feedback.mp3");

    //kaydedilen sesi backend api'ına gönderir
    try {
      const response = await fetch("https://your-api-endpoint.com/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Geri bildirim başarıyla gönderildi!");
        setAudioBlob(null);
        setRecordingCompleted(false);
      } else {
        alert("Bir hata oluştu, lütfen tekrar deneyin.");
      }
    } catch (err) {
      alert("Bağlantı sırasında bir hata oluştu.");
    }
  };

  //butonlar
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Sesli Geri Bildirim</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="kayitButton"
        style={{
          backgroundColor: isRecording ? "black" : "white",
          color: isRecording ? "white" : "black",
        }}
      >
        {isRecording
          ? "Kaydı Durdur"
          : recordingCompleted
          ? "Kayıt Tamamlandı"
          : "Kayda Başla"}
      </button>
      <button
        onClick={sendFeedback}
        disabled={!audioBlob}
        className="geriBildirimiGonderButton"
      >
        Geri Bildirimi Gönder
      </button>
    </div>
  );
};

export default AudioFeedback;
