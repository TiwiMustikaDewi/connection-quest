// Utility to generate HD 9:16 (1080 x 1920 px) Instagram Story Canvas
// Official AFL Winter Peak 2026 - Capacity Building 1 "Connection Quest"
// Exact match to user's reference mockup with scenic landscape hills background.
// 100% Pure Canvas 2D vector drawing — zero external images, zero tainted canvas risk!

function drawRoundRect(ctx, x, y, width, height, radius) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function _wrapText(ctx, text, x, startY, maxWidth, lineHeight, align = 'left') {
  if (!text) return 0;
  const words = String(text).split(' ');
  let line = '';
  const lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  ctx.textAlign = align;
  lines.forEach((l, index) => {
    ctx.fillText(l, x, startY + index * lineHeight);
  });

  return lines.length * lineHeight;
}

// Draw iOS-style gradient icon badge
function drawIosIconBadge(ctx, x, y, size, colorStop0, colorStop1, drawIcon) {
  const r = size * 0.28;
  const grad = ctx.createLinearGradient(x, y, x + size, y + size);
  grad.addColorStop(0, colorStop0);
  grad.addColorStop(1, colorStop1);

  ctx.save();
  drawRoundRect(ctx, x, y, size, size, r);
  ctx.fillStyle = grad;
  ctx.shadowColor = 'rgba(0,0,0,0.12)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Soft inner highlight
  ctx.save();
  ctx.clip();
  const hl = ctx.createLinearGradient(x, y, x + size, y + size * 0.5);
  hl.addColorStop(0, 'rgba(255,255,255,0.3)');
  hl.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = hl;
  ctx.fillRect(x, y, size, size);
  ctx.restore();

  ctx.restore();

  // Draw the icon content
  drawIcon(ctx, x, y, size);
}

// White person silhouette icon (Card 1)
function drawPersonIcon(ctx, x, y, size) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy - size * 0.15, size * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy + size * 0.28, size * 0.25, Math.PI, 0);
  ctx.fill();
  ctx.restore();
}

// White target rings icon (Card 2)
function drawTargetIcon(ctx, x, y, size) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  ctx.save();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = size * 0.075;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = size * 0.06;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.17, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.065, 0, Math.PI * 2);
  ctx.fill();
  // Small arrow feather on top-right
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = size * 0.055;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + size * 0.12, cy - size * 0.12);
  ctx.lineTo(cx + size * 0.32, cy - size * 0.32);
  ctx.stroke();
  ctx.restore();
}

// White 5-point star icon (Card 3)
function drawStarIcon(ctx, x, y, size) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const outerR = size * 0.30;
  const innerR = size * 0.14;
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Green circular checkmark badge for Strengths
function drawCheckmarkBadge(ctx, x, y, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#10B981';
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = radius * 0.32;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.42, y - radius * 0.02);
  ctx.lineTo(x - radius * 0.08, y + radius * 0.34);
  ctx.lineTo(x + radius * 0.46, y - radius * 0.32);
  ctx.stroke();
  ctx.restore();
}

// =============================================================================
// =============================================================================
// NATIVE CANVAS 2D MASCOT DRAWING (Exact match to 3 characters reference)
// =============================================================================
function drawMascotNative(ctx, avatarId, cx, cy) {
  const norm = (avatarId || 'milo').toLowerCase();

  ctx.save();

  // Ground shadow
  ctx.beginPath();
  ctx.ellipse(cx, cy + 185, 135, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(180, 83, 9, 0.28)';
  ctx.fill();

  // Common smartphone coordinates (on right side)
  const phoneX = cx + 138;
  const phoneY = cy - 65;

  function drawCommonPhone() {
    // Smartphone (White bezel with dark outline)
    drawRoundRect(ctx, phoneX, phoneY, 74, 126, 16);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Screen
    drawRoundRect(ctx, phoneX + 6, phoneY + 8, 62, 110, 10);
    ctx.fillStyle = '#FFFBEB';
    ctx.fill();

    // Pink Heart on Screen
    ctx.fillStyle = '#F43F5E';
    ctx.beginPath();
    const hx = phoneX + 37;
    const hy = phoneY + 62;
    ctx.moveTo(hx, hy + 18);
    ctx.bezierCurveTo(hx - 22, hy, hx - 22, hy - 18, hx, hy - 8);
    ctx.bezierCurveTo(hx + 22, hy - 18, hx + 22, hy, hx, hy + 18);
    ctx.fill();

    // Exactly 3 Vibrant vibration marks (///) above smartphone
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(phoneX + 40, phoneY - 8);
    ctx.lineTo(phoneX + 50, phoneY - 24);
    ctx.moveTo(phoneX + 58, phoneY - 4);
    ctx.lineTo(phoneX + 70, phoneY - 20);
    ctx.moveTo(phoneX + 74, phoneY + 4);
    ctx.lineTo(phoneX + 88, phoneY - 12);
    ctx.stroke();
  }

  if (norm === 'lumi') {
    // =======================================================================
    // LUMI: Mint Jelly Gumdrop Droplet (The Gentle Listener)
    // =======================================================================
    // Stubby rounded mint feet resting on the ground
    ctx.fillStyle = '#34D399';
    ctx.beginPath();
    ctx.ellipse(cx - 44, cy + 165, 24, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 44, cy + 165, 24, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Smooth mint gumdrop body
    const lumiGrad = ctx.createLinearGradient(cx - 90, cy - 140, cx + 90, cy + 150);
    lumiGrad.addColorStop(0, '#D1FAE5');
    lumiGrad.addColorStop(0.35, '#A7F3D0');
    lumiGrad.addColorStop(0.8, '#6EE7B7');
    lumiGrad.addColorStop(1, '#34D399');
    ctx.fillStyle = lumiGrad;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 135);
    ctx.bezierCurveTo(cx + 85, cy - 135, cx + 115, cy - 40, cx + 110, cy + 60);
    ctx.bezierCurveTo(cx + 105, cy + 130, cx + 75, cy + 155, cx, cy + 155);
    ctx.bezierCurveTo(cx - 75, cy + 155, cx - 105, cy + 130, cx - 110, cy + 60);
    ctx.bezierCurveTo(cx - 115, cy - 40, cx - 85, cy - 135, cx, cy - 135);
    ctx.closePath();
    ctx.fill();

    // Specular highlight on top-left of head
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx - 40, cy - 70, 34, 20, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fill();
    ctx.restore();

    // Soft Rosy Cheeks
    ctx.fillStyle = 'rgba(253, 164, 175, 0.85)';
    ctx.beginPath();
    ctx.ellipse(cx - 65, cy + 42, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 65, cy + 42, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Big anime eyes with double sparkles
    const eyeY = cy + 10;
    const eyeSpacing = 42;
    // Left eye
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing, eyeY, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing - 5, eyeY - 6, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing + 5, eyeY + 6, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Right eye
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing, eyeY, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing - 5, eyeY - 6, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing + 5, eyeY + 6, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Sweet gentle smile
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, eyeY + 26, 13, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // Left waving mint arm
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 13;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 95, cy + 45);
    ctx.quadraticCurveTo(cx - 145, cy + 10, cx - 165, cy - 35);
    ctx.stroke();
    ctx.fillStyle = '#6EE7B7';
    ctx.beginPath();
    ctx.arc(cx - 165, cy - 35, 10, 0, Math.PI * 2);
    ctx.fill();

    // Right mint arm holding phone
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 13;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + 95, cy + 50);
    ctx.quadraticCurveTo(cx + 125, cy + 55, cx + 150, cy + 25);
    ctx.stroke();

    drawCommonPhone();
  } else if (norm === 'kiko') {
    // =======================================================================
    // KIKO: Indigo 6-Point Rounded Star (The Energetic Connector)
    // =======================================================================
    // Cartoon stick legs & black shoes
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 36, cy + 90);
    ctx.lineTo(cx - 40, cy + 172);
    ctx.moveTo(cx + 36, cy + 90);
    ctx.lineTo(cx + 40, cy + 172);
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.ellipse(cx - 48, cy + 174, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 48, cy + 174, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Kiko 6-pointed rounded star body
    const kikoGrad = ctx.createLinearGradient(cx - 120, cy - 140, cx + 120, cy + 140);
    kikoGrad.addColorStop(0, '#818CF8');
    kikoGrad.addColorStop(0.3, '#6366F1');
    kikoGrad.addColorStop(1, '#4F46E5');
    ctx.fillStyle = kikoGrad;
    ctx.beginPath();
    const outerR = 142;
    const innerR = 76;
    for (let i = 0; i < 12; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (i * Math.PI) / 6 - Math.PI / 2;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else {
        const prevA = ((i - 1) * Math.PI) / 6 - Math.PI / 2;
        const cpx = cx + Math.cos((prevA + a) / 2) * (r * 0.95);
        const cpy = cy + Math.sin((prevA + a) / 2) * (r * 0.95);
        ctx.quadraticCurveTo(cpx, cpy, px, py);
      }
    }
    ctx.closePath();
    ctx.fill();

    // Light blue highlight blob on top-left lobe
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx - 40, cy - 65, 28, 16, -0.35, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(165, 180, 252, 0.75)';
    ctx.fill();
    ctx.restore();

    // Signature Bright Golden Yellow / Orange Blushes (as in reference image!)
    ctx.fillStyle = 'rgba(251, 191, 36, 0.95)';
    ctx.beginPath();
    ctx.ellipse(cx - 56, cy + 22, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 56, cy + 22, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Playful eyes with sparkle
    const kikoEyeY = cy - 2;
    const kikoSpacing = 40;
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(cx - kikoSpacing, kikoEyeY, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx - kikoSpacing - 4, kikoEyeY - 4, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(cx + kikoSpacing, kikoEyeY, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx + kikoSpacing - 4, kikoEyeY - 4, 5, 0, Math.PI * 2);
    ctx.fill();

    // Sweet smile
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, kikoEyeY + 22, 12, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // Left waving arm (black stick arm)
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 90, cy + 10);
    ctx.quadraticCurveTo(cx - 140, cy - 20, cx - 165, cy - 55);
    ctx.stroke();
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(cx - 165, cy - 55, 8, 0, Math.PI * 2);
    ctx.fill();

    // Right arm holding phone
    ctx.beginPath();
    ctx.moveTo(cx + 90, cy + 20);
    ctx.quadraticCurveTo(cx + 130, cy + 30, cx + 155, cy + 12);
    ctx.stroke();

    drawCommonPhone();
  } else {
    // =======================================================================
    // MILO: Sunny Golden Ball Mascot (The Joyful Explorer, Default)
    // =======================================================================
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 38, cy + 105);
    ctx.lineTo(cx - 44, cy + 175);
    ctx.moveTo(cx + 38, cy + 105);
    ctx.lineTo(cx + 44, cy + 175);
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.ellipse(cx - 52, cy + 176, 28, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 52, cy + 176, 28, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Round golden sphere
    const miloGrad = ctx.createLinearGradient(cx - 110, cy - 130, cx + 110, cy + 130);
    miloGrad.addColorStop(0, '#FEF08A');
    miloGrad.addColorStop(0.35, '#FDE047');
    miloGrad.addColorStop(0.75, '#FBBF24');
    miloGrad.addColorStop(1, '#F59E0B');
    ctx.fillStyle = miloGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 142, 0, Math.PI * 2);
    ctx.fill();

    // Specular highlight
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx - 44, cy - 72, 40, 20, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fill();
    ctx.restore();

    // Eyebrows
    const eyeY = cy - 8;
    const eyeSpacing = 48;
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing, eyeY - 26, 12, 1.15 * Math.PI, 1.85 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing, eyeY - 26, 12, 1.15 * Math.PI, 1.85 * Math.PI);
    ctx.stroke();

    // Eyes with white highlights
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.ellipse(cx - eyeSpacing, eyeY, 15, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing - 5, eyeY - 7, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing + 5, eyeY + 8, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.ellipse(cx + eyeSpacing, eyeY, 15, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing - 5, eyeY - 7, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing + 5, eyeY + 8, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Rosy Cheeks
    ctx.fillStyle = 'rgba(244, 63, 94, 0.8)';
    ctx.beginPath();
    ctx.ellipse(cx - 80, cy + 24, 22, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 80, cy + 24, 22, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Open Happy Smile with Tongue
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy + 24, 30, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.lineTo(cx, cy + 24);
    ctx.closePath();
    ctx.fillStyle = '#991B1B';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + 24, 30, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy + 42, 16, Math.PI, 0);
    ctx.fillStyle = '#F472B6';
    ctx.fill();
    ctx.restore();

    // Left Waving Arm
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 115, cy + 15);
    ctx.quadraticCurveTo(cx - 150, cy - 15, cx - 170, cy - 55);
    ctx.stroke();
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(cx - 170, cy - 55, 10, 0, Math.PI * 2);
    ctx.fill();

    // Right Arm holding Smartphone
    ctx.beginPath();
    ctx.moveTo(cx + 115, cy + 20);
    ctx.quadraticCurveTo(cx + 145, cy + 30, cx + 160, cy + 12);
    ctx.stroke();

    drawCommonPhone();
  }

  ctx.restore();
}

export async function generateStoryCanvas({
  participant,
  endingData,
  reflection,
  _certId,
  _todayDate,
  isIndo,
}) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const participantName = participant?.name || 'ggtut';
  const participantHomegroup = participant?.homegroup || '13';
  const avatarId = participant?.avatarId || 'milo';

  // =========================================================================
  // 1. SCENIC ROLLING HILLS / DUNES BACKGROUND (Pastel Yellow "Suatu Tempat")
  // =========================================================================
  // Base soft golden yellow gradient sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 1920);
  skyGrad.addColorStop(0, '#FFFDF0'); // Pale soft ivory/cream
  skyGrad.addColorStop(0.3, '#FEF9C3'); // Warm sunny pastel
  skyGrad.addColorStop(0.65, '#FEF08A'); // Warm honey
  skyGrad.addColorStop(1, '#FDE68A');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Distant warm rolling hills layer 1 (Upper sky)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 340);
  ctx.bezierCurveTo(280, 220, 780, 400, 1080, 260);
  ctx.lineTo(1080, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
  ctx.fill();

  // Floating soft sun dots in the sky (matching reference mockup)
  ctx.fillStyle = 'rgba(253, 224, 71, 0.5)';
  ctx.beginPath();
  ctx.arc(980, 300, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(90, 260, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(920, 180, 16, 0, Math.PI * 2);
  ctx.fill();

  // Warm circular sun dome rising behind the mascot
  ctx.beginPath();
  ctx.arc(540, 480, 290, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
  ctx.fill();

  // Rolling hill curve behind mascot feet
  ctx.beginPath();
  ctx.moveTo(0, 640);
  ctx.bezierCurveTo(260, 540, 820, 680, 1080, 580);
  ctx.lineTo(1080, 1920);
  ctx.lineTo(0, 1920);
  ctx.closePath();
  ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';
  ctx.fill();

  // Foreground rolling hill curve where mascot stands firmly
  ctx.beginPath();
  ctx.moveTo(0, 730);
  ctx.bezierCurveTo(320, 660, 760, 660, 1080, 720);
  ctx.lineTo(1080, 1920);
  ctx.lineTo(0, 1920);
  ctx.closePath();
  ctx.fillStyle = '#FEF08A';
  ctx.fill();

  // Bottom rolling dunes beneath cards
  ctx.beginPath();
  ctx.moveTo(0, 1720);
  ctx.bezierCurveTo(360, 1660, 720, 1760, 1080, 1690);
  ctx.lineTo(1080, 1920);
  ctx.lineTo(0, 1920);
  ctx.closePath();
  ctx.fillStyle = 'rgba(253, 224, 71, 0.5)';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 1800);
  ctx.bezierCurveTo(400, 1840, 780, 1760, 1080, 1820);
  ctx.lineTo(1080, 1920);
  ctx.lineTo(0, 1920);
  ctx.closePath();
  ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.fill();
  ctx.restore();

  // =========================================================================
  // 2. TOP HEADER (Exact Match to User's Mockup)
  // =========================================================================
  // Top-Left: AFL / WINTER PEAK 2026 / CAPACITY BUILDING 1
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = '900 48px system-ui, -apple-system, sans-serif';
  ctx.fillText('AFL', 70, 110);

  ctx.font = '800 24px system-ui, -apple-system, sans-serif';
  ctx.fillText('WINTER PEAK 2026', 70, 145);

  // Yellow accent line under WINTER PEAK 2026
  ctx.fillStyle = '#F59E0B';
  drawRoundRect(ctx, 70, 156, 72, 5, 2.5);
  ctx.fill();

  ctx.fillStyle = '#0F172A';
  ctx.font = '700 19px system-ui, -apple-system, sans-serif';
  ctx.fillText('CAPACITY BUILDING 1', 70, 194);

  // Top-Right: CONNECTION QUEST / Every choice shapes your connection.
  ctx.textAlign = 'right';
  ctx.fillStyle = '#0F172A';
  ctx.font = '800 26px system-ui, -apple-system, sans-serif';
  ctx.fillText('CONNECTION', 1010, 110);

  ctx.font = '900 48px system-ui, -apple-system, sans-serif';
  ctx.fillText('QUEST', 1010, 155);

  ctx.fillStyle = '#64748B';
  ctx.font = 'italic 500 20px system-ui, sans-serif';
  ctx.fillText('Every choice shapes your connection.', 1010, 194);

  // =========================================================================
  // 3. HERO MASCOT STAGE (Standing on Landscape Hill)
  // =========================================================================
  drawMascotNative(ctx, avatarId, 540, 485);

  // =========================================================================
  // 4. CARDS (Exact match to User's Reference Mockup Layout)
  // =========================================================================
  const title = isIndo ? endingData?.titleId : endingData?.titleEn;
  const subtitle = isIndo ? endingData?.subtitleId : endingData?.subtitleEn;
  const strengths = isIndo
    ? endingData?.strengthsId || ['Active Listening', 'Empati & Validasi Rasa', 'Adaptabilitas Komunikasi', 'Peredam Ketegangan']
    : endingData?.strengthsEn || ['Active Listening', 'Empathy & Validation', 'Communication Adaptability', 'De-escalation'];

  const pledgeText =
    reflection?.nextAction ||
    (isIndo
      ? 'Mulai obrolan baru'
      : 'Start a new conversation');
  const targetText = reflection?.targetEnvironment || (isIndo ? 'Organisasi Kampus' : 'Campus Organization');
  const strategyText = reflection?.strategyToPractice || (isIndo ? 'Active listening' : 'Active listening');

  const CARD_X = 64;
  const CARD_W = 1080 - CARD_X * 2; // 952px
  const ICON_SIZE = 114;
  const ICON_PAD = 26;
  const CONTENT_X = CARD_X + ICON_PAD + ICON_SIZE + 26;
  const CHEVRON_X = CARD_X + CARD_W - 46;

  function drawWhiteCard(x, y, w, h) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.07)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    drawRoundRect(ctx, x, y, w, h, 32);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.restore();
  }

  function drawChevron(cy) {
    ctx.save();
    ctx.fillStyle = '#94A3B8';
    ctx.font = '300 54px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('›', CHEVRON_X, cy + 18);
    ctx.restore();
  }

  // ── CARD 1: Identitas Peserta ─────────────────────────────────────────────
  const c1Y = 740;
  const c1H = 228;
  drawWhiteCard(CARD_X, c1Y, CARD_W, c1H);
  const icon1Y = c1Y + (c1H - ICON_SIZE) / 2;
  // Soft purple gradient icon
  drawIosIconBadge(ctx, CARD_X + ICON_PAD, icon1Y, ICON_SIZE, '#C4B5FD', '#818CF8', drawPersonIcon);
  drawChevron(c1Y + c1H / 2);

  ctx.textAlign = 'left';
  // Eyebrow: PESERTA • HOMEGROUP 13
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  const cleanHg = String(participantHomegroup).replace(/^homegroup\s*/i, '');
  ctx.fillText(`${isIndo ? 'PESERTA' : 'PARTICIPANT'} • HOMEGROUP ${cleanHg}`, CONTENT_X, c1Y + 54);

  // Participant Name (Big, Bold, Navy)
  ctx.fillStyle = '#0F172A';
  ctx.font = '900 44px system-ui, -apple-system, sans-serif';
  ctx.fillText(participantName, CONTENT_X, c1Y + 104, CARD_W - 230);

  // Connection Archetype Title (Vibrant Purple)
  ctx.fillStyle = '#7C3AED';
  ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
  ctx.fillText(title || 'The Bridge Builder', CONTENT_X, c1Y + 148, CARD_W - 230);

  // Subtitle Quote (Slate Italic)
  ctx.fillStyle = '#475569';
  ctx.font = 'italic 500 22px system-ui, sans-serif';
  ctx.fillText(`“${subtitle || (isIndo ? 'Sosok Penjembatan & Pendengar Penuh Empati' : 'A Bridge Builder & Empathetic Listener')}”`, CONTENT_X, c1Y + 188, CARD_W - 230);

  // ── CARD 2: Komitmen Tindakan 48 Jam (Two-column Target & Strategi) ───────
  const c2Y = 998;
  const c2H = 252;
  drawWhiteCard(CARD_X, c2Y, CARD_W, c2H);
  const icon2Y = c2Y + (c2H - ICON_SIZE) / 2;
  // Soft coral/pink gradient icon with target
  drawIosIconBadge(ctx, CARD_X + ICON_PAD, icon2Y, ICON_SIZE, '#FECDD3', '#FB7185', drawTargetIcon);
  drawChevron(c2Y + c2H / 2);

  ctx.textAlign = 'left';
  // Eyebrow: KOMITMEN TINDAKAN 48 JAM (Red/Rose)
  ctx.fillStyle = '#E11D48';
  ctx.font = '900 22px system-ui, -apple-system, sans-serif';
  ctx.fillText(isIndo ? 'KOMITMEN TINDAKAN 48 JAM' : '48-HOUR ACTION PLEDGE', CONTENT_X, c2Y + 54);

  // Pledge Quote in quotes
  ctx.fillStyle = '#0F172A';
  ctx.font = '900 34px system-ui, -apple-system, sans-serif';
  ctx.fillText(`“${pledgeText}”`, CONTENT_X, c2Y + 104, CARD_W - 230);

  // Two columns with vertical divider
  const col1X = CONTENT_X;
  const dividerX = CONTENT_X + 270;
  const col2X = CONTENT_X + 300;

  // Vertical divider line |
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(dividerX, c2Y + 132);
  ctx.lineTo(dividerX, c2Y + 204);
  ctx.stroke();

  // Column 1: Target
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.fillText('Target', col1X + 36, c2Y + 152);
  ctx.font = '26px sans-serif';
  ctx.fillText('📍', col1X, c2Y + 192);
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText(targetText, col1X + 36, c2Y + 192, 220);

  // Column 2: Strategi
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.fillText(isIndo ? 'Strategi' : 'Strategy', col2X + 36, c2Y + 152);
  ctx.font = '26px sans-serif';
  ctx.fillText('💡', col2X, c2Y + 192);
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText(strategyText, col2X + 36, c2Y + 192, 240);

  // ── CARD 3: Kekuatan Karakter Utama (2x2 Grid with Green Checkmarks) ──────
  const c3Y = 1280;
  const c3H = 220;
  drawWhiteCard(CARD_X, c3Y, CARD_W, c3H);
  const icon3Y = c3Y + (c3H - ICON_SIZE) / 2;
  // Mint/emerald gradient badge with 5-point star
  drawIosIconBadge(ctx, CARD_X + ICON_PAD, icon3Y, ICON_SIZE, '#6EE7B7', '#10B981', drawStarIcon);
  drawChevron(c3Y + c3H / 2);

  ctx.textAlign = 'left';
  // Eyebrow: KEKUATAN KARAKTER UTAMA (Green)
  ctx.fillStyle = '#059669';
  ctx.font = '900 22px system-ui, -apple-system, sans-serif';
  ctx.fillText(isIndo ? 'KEKUATAN KARAKTER UTAMA' : 'SIGNATURE STRENGTHS', CONTENT_X, c3Y + 54);

  // 4 items in 2x2 grid with green circular checkmark badges
  const gridCol1 = CONTENT_X;
  const gridCol2 = CONTENT_X + 340;

  // Row 1
  drawCheckmarkBadge(ctx, gridCol1 + 14, c3Y + 110, 15);
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText(strengths[0] || 'Active Listening', gridCol1 + 40, c3Y + 118, 290);

  drawCheckmarkBadge(ctx, gridCol2 + 14, c3Y + 110, 15);
  ctx.fillText(strengths[1] || (isIndo ? 'Empati & Validasi Rasa' : 'Empathy & Validation'), gridCol2 + 40, c3Y + 118, 290);

  // Row 2
  drawCheckmarkBadge(ctx, gridCol1 + 14, c3Y + 168, 15);
  ctx.fillText(strengths[2] || (isIndo ? 'Adaptabilitas Komunikasi' : 'Communication Adaptability'), gridCol1 + 40, c3Y + 176, 290);

  drawCheckmarkBadge(ctx, gridCol2 + 14, c3Y + 168, 15);
  ctx.fillText(strengths[3] || (isIndo ? 'Peredam Ketegangan' : 'De-escalation'), gridCol2 + 40, c3Y + 176, 290);

  // ── CARD 4: Tag Instagram @ewaapeyek (Centered Clean Pill Banner) ─────────
  const c4Y = 1530;
  const c4H = 135;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.06)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 4;
  drawRoundRect(ctx, CARD_X, c4Y, CARD_W, c4H, 30);
  // Soft tinted lavender fill (matching reference mockup!)
  ctx.fillStyle = '#EEF2FF';
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.restore();

  // Centered text: Tag Instagram @ewaapeyek
  ctx.save();
  ctx.textBaseline = 'middle';
  const tagCenterY = c4Y + c4H / 2;

  ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#475569';
  const prefixText = isIndo ? 'Tag Instagram ' : 'Tag on Instagram ';
  const prefixWidth = ctx.measureText(prefixText).width;

  ctx.font = '900 34px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#0F172A';
  const handleText = '@ewaapeyek';
  const handleWidth = ctx.measureText(handleText).width;

  const totalW = prefixWidth + handleWidth;
  const startX = 540 - totalW / 2;

  ctx.textAlign = 'left';
  ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText(prefixText, startX, tagCenterY);

  ctx.font = '900 34px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#0F172A';
  ctx.fillText(handleText, startX + prefixWidth, tagCenterY);
  ctx.restore();

  return canvas;
}
