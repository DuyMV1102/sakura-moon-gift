# Sakura River Valley (3D WebGL / Three.js)

Real-time 3D mountain river valley in feudal East Asia at golden hour (cloned 1:1 from `https://valley.mengto.here.now/`).

## Stack & Kiến trúc
- **Engine**: Three.js (r186) custom bundle với procedural terrain, foliage generation, dynamic river shaders, water reflection/refraction, custom lighting & shadows (PCF shadow maps).
- **Assets**: 45 CC0 scanned assets (Poly Haven): đá, rêu, vỏ cây sakura/thông, sỏi, mái ngói đền, cây dương xỉ, mô hình nhân vật (boatman, woman, monk) nén gzip binary mesh (`.msh.gz`) và texture WebP.
- **Loading UI**: Hiệu ứng vòng tròn Ensō thư pháp xoay động vẽ bằng SVG + stroke-dashoffset đồng bộ tiến trình load 3D scene.
- **Controls & Interaction**:
  - Chuột trái / kéo cảm ứng: Xoay góc nhìn (orbit/look around).
  - Phím `T`: Tua nhanh chu kỳ ngày/đêm (day/night time-scale x30).
  - Tự động điều chỉnh độ phân giải theo hiệu năng phần cứng (dynamic resolution scaling).
  - Camera tự động xuôi dòng thuyền trôi theo sông feudal valley.
  - Console API: `window.__v` expose toàn bộ Three.js scene, camera, rig, weather, sun, shot controls.

## Khởi chạy (Local Server)

### Cách 1: Python (Không cần cài thư viện)
```bash
python3 server.py --port 3000
```

### Cách 2: Node.js / Vite
```bash
npm run dev
# hoặc
npx serve . -l 3000
```

Truy cập: `http://localhost:3000`
