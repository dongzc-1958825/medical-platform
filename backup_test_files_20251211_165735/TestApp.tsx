import * as React from 'react';

// src/TestApp.tsx
export default function TestApp() {
  console.log('馃敡 [TEST] TestApp缁勪欢娓叉煋寮€濮?);
  
  // 绠€鍗曠殑缁勪欢锛屾病鏈変换浣曞鏉傞€昏緫
  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>
      <h1 style={{ color: 'green' }}>鉁?娴嬭瘯鎴愬姛 - App缁勪欢娓叉煋姝ｅ父</h1>
      <p>濡傛灉鐪嬪埌杩欎釜椤甸潰锛岃鏄庡熀纭€娓叉煋姝ｅ父</p>
      <p>鐜: {import.meta.env.MODE}</p>
      <div style={{ marginTop: '30px', padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h3>娴嬭瘯淇℃伅锛?/h3>
        <p>鏃堕棿: {new Date().toLocaleString()}</p>
        <p>璺緞: {window.location.href}</p>
      </div>
    </div>
  );
}
