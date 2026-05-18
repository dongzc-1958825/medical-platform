import React, { useState } from "react";
import { supabase } from "./services/supabaseClient";

export default function StandalonePublish() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePublish = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("未登录");

    const { error } = await supabase.from("cases").insert({
      title,
      content,
      user_id: user.id,
      created_at: new Date().toISOString(),
    });

    alert(error ? "失败：" + error.message : "✅ 写入成功！");
    if (!error) setTitle("");
  };

  return (
    <div className="p-4">
      <input className="border p-2 w-full mb-2" placeholder="标题" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="border p-2 w-full mb-2" placeholder="内容" value={content} onChange={(e) => setContent(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handlePublish}>发布</button>
    </div>
  );
}