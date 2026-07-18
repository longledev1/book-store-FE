import React, { useEffect, useRef } from "react";

export const BookConstellationCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Particle class rising from the book
    class KnowledgeParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
      wobbleSpeed: number;
      wobbleAmount: number;
      wobbleOffset: number;
      type: "circle" | "sparkle";

      constructor(spawnX: number, spawnY: number) {
        this.x = spawnX;
        this.y = spawnY;
        this.vy = -Math.random() * 0.9 - 0.5;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2.5 + 1.2;
        
        const colors = [
          "rgba(6, 182, 212, ",   // Cyan
          "rgba(99, 102, 241, ",  // Indigo
          "rgba(37, 99, 235, ",   // Blue
          "rgba(251, 191, 36, ",  // Gold/Amber
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        this.alpha = 1;
        this.decay = Math.random() * 0.006 + 0.004;
        this.wobbleSpeed = Math.random() * 0.06 + 0.02;
        this.wobbleAmount = Math.random() * 2 + 0.5;
        this.wobbleOffset = Math.random() * Math.PI * 2;
        this.type = Math.random() > 0.7 ? "sparkle" : "circle";
      }

      draw(context: CanvasRenderingContext2D, time: number) {
        context.save();
        context.globalAlpha = this.alpha;
        context.shadowBlur = 6;
        context.shadowColor = this.color + "1)";

        const currentX = this.x + Math.sin(time * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmount;

        if (this.type === "sparkle") {
          context.fillStyle = "#ffffff";
          context.beginPath();
          context.moveTo(currentX, this.y - this.size * 1.6);
          context.lineTo(currentX + this.size / 2, this.y - this.size / 2);
          context.lineTo(currentX + this.size * 1.6, this.y);
          context.lineTo(currentX + this.size / 2, this.y + this.size / 2);
          context.lineTo(currentX, this.y + this.size * 1.6);
          context.lineTo(currentX - this.size / 2, this.y + this.size / 2);
          context.lineTo(currentX - this.size * 1.6, this.y);
          context.lineTo(currentX - this.size / 2, this.y - this.size / 2);
          context.closePath();
          context.fill();
        } else {
          context.fillStyle = this.color + "1)";
          context.beginPath();
          context.arc(currentX, this.y, this.size, 0, Math.PI * 2);
          context.fill();
        }

        context.restore();
      }

      update(mousePos: { x: number; y: number; active: boolean }) {
        this.y += this.vy;
        this.x += this.vx;
        this.alpha -= this.decay;

        if (mousePos.active) {
          const dx = mousePos.x - this.x;
          const dy = mousePos.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const force = (1 - dist / 160) * 0.025;
            this.vx += dx * force;
            this.vy += dy * force;
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 2.8) {
              this.vx = (this.vx / speed) * 2.8;
              this.vy = (this.vy / speed) * 2.8;
            }
          }
        }
      }
    }

    let particles: KnowledgeParticle[] = [];
    let time = 0;

    // Mouse coordinates
    let mouse = { x: -9999, y: -9999, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Animation loop
    const animate = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      // Book geometry dimensions
      const bookWidth = width * 0.54;
      const bookHeight = height * 0.24;
      const centerX = width / 2;
      const centerY = height * 0.72;

      // 3D tilt interaction based on mouse coordinates
      let tiltX = 0;
      let tiltY = 0;
      if (mouse.active) {
        tiltX = (mouse.x - centerX) * 0.045;
        tiltY = (mouse.y - centerY) * 0.035;
      }

      const spineX = centerX + tiltX;
      const spineY = centerY + tiltY;

      // Spawn particles from page centers
      if (particles.length < 80 && Math.random() > 0.4) {
        const isLeftPage = Math.random() > 0.5;
        const pageSpread = (Math.random() * bookWidth) / 2.3;
        const spawnX = isLeftPage ? spineX - pageSpread : spineX + pageSpread;
        // Curve offset calculation for particles spawn coordinates
        const curveOffset = Math.sin((pageSpread / (bookWidth / 2)) * Math.PI) * 16;
        const spawnY = spineY - bookHeight / 3 - curveOffset - 5;
        
        particles.push(new KnowledgeParticle(spawnX, spawnY));
      }

      // Update and draw particles
      particles = particles.filter((p) => p.alpha > 0);
      particles.forEach((p) => {
        p.update(mouse);
        p.draw(ctx, time);
      });

      // DRAW REALISTIC DETAILED BOOK
      ctx.save();

      // 1. Draw Under-Book soft desk shadow
      ctx.fillStyle = "rgba(2, 6, 23, 0.55)";
      ctx.beginPath();
      ctx.ellipse(spineX, spineY + bookHeight / 2 + 12, bookWidth / 1.8, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Hard leather cover (binding block)
      ctx.shadowBlur = 18;
      ctx.shadowColor = "rgba(99, 102, 241, 0.4)"; // Indigo neon back-glow
      ctx.fillStyle = "#1e293b"; // Leather cover
      ctx.strokeStyle = "rgba(99, 102, 241, 0.85)"; // Glowing cover border
      ctx.lineWidth = 3.5;

      ctx.beginPath();
      // Bottom spine
      ctx.moveTo(spineX, spineY + bookHeight / 2 + 8);
      // Left bottom curve
      ctx.quadraticCurveTo(spineX - bookWidth / 4, spineY + bookHeight / 2 + 14, spineX - bookWidth / 2 - 6, spineY + bookHeight / 3 + 8);
      // Left outer edge
      ctx.lineTo(spineX - bookWidth / 2 - 6, spineY - bookHeight / 2 + 10);
      // Left top curve
      ctx.quadraticCurveTo(spineX - bookWidth / 4, spineY - bookHeight / 3 + 8, spineX, spineY - bookHeight / 2.6 + 6);
      // Right top curve
      ctx.quadraticCurveTo(spineX + bookWidth / 4, spineY - bookHeight / 3 + 8, spineX + bookWidth / 2 + 6, spineY - bookHeight / 2 + 10);
      // Right outer edge
      ctx.lineTo(spineX + bookWidth / 2 + 6, spineY + bookHeight / 3 + 8);
      // Right bottom curve
      ctx.quadraticCurveTo(spineX + bookWidth / 4, spineY + bookHeight / 2 + 14, spineX, spineY + bookHeight / 2 + 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0; // Reset cover glow

      // 3. Draw book thickness (stacked pages edges under the top page)
      ctx.fillStyle = "#cbd5e1"; // Light gray pages edge texture
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1;

      // Draw left thickness block
      ctx.beginPath();
      ctx.moveTo(spineX - bookWidth / 2, spineY - bookHeight / 2 + 8);
      ctx.lineTo(spineX - bookWidth / 2 - 5, spineY - bookHeight / 2 + 10);
      ctx.lineTo(spineX - bookWidth / 2 - 5, spineY + bookHeight / 3 + 8);
      ctx.lineTo(spineX - bookWidth / 2, spineY + bookHeight / 3 + 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw right thickness block
      ctx.beginPath();
      ctx.moveTo(spineX + bookWidth / 2, spineY - bookHeight / 2 + 8);
      ctx.lineTo(spineX + bookWidth / 2 + 5, spineY - bookHeight / 2 + 10);
      ctx.lineTo(spineX + bookWidth / 2 + 5, spineY + bookHeight / 3 + 8);
      ctx.lineTo(spineX + bookWidth / 2, spineY + bookHeight / 3 + 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw stacked lines on the thickness block to represent pages
      ctx.strokeStyle = "rgba(71, 85, 105, 0.4)";
      for (let i = 1; i <= 3; i++) {
        const offset = i * 1.5;
        // Left lines
        ctx.beginPath();
        ctx.moveTo(spineX - bookWidth / 2 - offset, spineY - bookHeight / 2 + 9);
        ctx.lineTo(spineX - bookWidth / 2 - offset, spineY + bookHeight / 3 + 7);
        ctx.stroke();
        // Right lines
        ctx.beginPath();
        ctx.moveTo(spineX + bookWidth / 2 + offset, spineY - bookHeight / 2 + 9);
        ctx.lineTo(spineX + bookWidth / 2 + offset, spineY + bookHeight / 3 + 7);
        ctx.stroke();
      }

      // 4. Draw the actual pages (stacked layers for page curved depth)
      const pageColors = ["#475569", "#94a3b8", "#f8fafc"];
      const pageOffsets = [4, 2, 0];

      pageOffsets.forEach((offset, idx) => {
        ctx.fillStyle = pageColors[idx];
        ctx.strokeStyle = idx === 2 ? "rgba(6, 182, 212, 0.7)" : "rgba(255, 255, 255, 0.1)"; // Glowing cyan outline on top page
        ctx.lineWidth = idx === 2 ? 1.5 : 1;

        // LEFT PAGE SHAPE
        ctx.beginPath();
        ctx.moveTo(spineX, spineY + offset);
        // Curve to bottom left
        ctx.quadraticCurveTo(spineX - bookWidth / 4, spineY + bookHeight / 2.3 + offset, spineX - bookWidth / 2, spineY + bookHeight / 3.3 + offset);
        // Line to top left
        ctx.lineTo(spineX - bookWidth / 2, spineY - bookHeight / 2.2 + offset);
        // Curve to top spine
        ctx.quadraticCurveTo(spineX - bookWidth / 4, spineY - bookHeight / 3.3 + offset, spineX, spineY - bookHeight / 2.8 + offset);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // RIGHT PAGE SHAPE
        ctx.beginPath();
        ctx.moveTo(spineX, spineY + offset);
        // Curve to bottom right
        ctx.quadraticCurveTo(spineX + bookWidth / 4, spineY + bookHeight / 2.3 + offset, spineX + bookWidth / 2, spineY + bookHeight / 3.3 + offset);
        // Line to top right
        ctx.lineTo(spineX + bookWidth / 2, spineY - bookHeight / 2.2 + offset);
        // Curve to top spine
        ctx.quadraticCurveTo(spineX + bookWidth / 4, spineY - bookHeight / 3.3 + offset, spineX, spineY - bookHeight / 2.8 + offset);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      // 5. Draw realistic book center spine fold shadow
      const spineGlow = ctx.createLinearGradient(spineX - 6, spineY, spineX + 6, spineY);
      spineGlow.addColorStop(0, "rgba(248, 248, 252, 0)");
      spineGlow.addColorStop(0.3, "rgba(15, 23, 42, 0.4)");
      spineGlow.addColorStop(0.5, "rgba(15, 23, 42, 0.8)");
      spineGlow.addColorStop(0.7, "rgba(15, 23, 42, 0.4)");
      spineGlow.addColorStop(1, "rgba(248, 248, 252, 0)");

      ctx.fillStyle = spineGlow;
      ctx.beginPath();
      ctx.moveTo(spineX - 6, spineY - bookHeight / 2.8);
      ctx.lineTo(spineX + 6, spineY - bookHeight / 2.8);
      ctx.lineTo(spineX + 6, spineY + bookHeight / 2.2);
      ctx.lineTo(spineX - 6, spineY + bookHeight / 2.2);
      ctx.closePath();
      ctx.fill();

      // 6. Draw Bookmark Ribbon hanging out of spine (The killer visual book anchor)
      ctx.save();
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(239, 68, 68, 0.5)"; // Soft red ribbon glow
      ctx.fillStyle = "#ef4444"; // Ribbon Red
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      // Start from spine fold bottom
      ctx.moveTo(spineX - 2.5, spineY + bookHeight / 2.8);
      // Curve down and swirl right
      ctx.quadraticCurveTo(spineX - 4, spineY + bookHeight / 1.8, spineX + 8, spineY + bookHeight / 1.5);
      ctx.lineTo(spineX + 13, spineY + bookHeight / 1.5);
      ctx.quadraticCurveTo(spineX + 1, spineY + bookHeight / 1.8, spineX + 2.5, spineY + bookHeight / 2.8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 7. Draw Stylized Drop Cap on Left Page ("A" for AI)
      ctx.fillStyle = "rgba(37, 99, 235, 0.85)"; // Blue dropcap
      ctx.font = "bold 13px 'Inter', sans-serif";
      ctx.fillText("A", spineX - bookWidth / 2 + 10, spineY - bookHeight / 4 + 7);

      // 8. Draw realistic paragraph lines
      ctx.strokeStyle = "rgba(71, 85, 105, 0.28)"; // Soft text print
      ctx.lineWidth = 1.8;

      // Left page text lines (indent first line for drop cap)
      ctx.beginPath();
      ctx.moveTo(spineX - bookWidth / 2 + 22, spineY - bookHeight / 4 + 4);
      ctx.quadraticCurveTo(spineX - bookWidth / 4, spineY - bookHeight / 4 + 7, spineX - 10, spineY - bookHeight / 4 + 6);
      ctx.stroke();

      for (let i = 0; i < 4; i++) {
        const lineOffset = -bookHeight / 4 + 14 + i * 8;
        ctx.beginPath();
        ctx.moveTo(spineX - bookWidth / 2 + 10, spineY + lineOffset);
        ctx.quadraticCurveTo(spineX - bookWidth / 4, spineY + lineOffset + 3, spineX - 10, spineY + lineOffset + 2);
        ctx.stroke();
      }

      // Right page text lines
      for (let i = 0; i < 5; i++) {
        const lineOffset = -bookHeight / 4 + 4 + i * 8;
        ctx.beginPath();
        ctx.moveTo(spineX + 10, spineY + lineOffset + 2);
        ctx.quadraticCurveTo(spineX + bookWidth / 4, spineY + lineOffset + 3, spineX + bookWidth / 2 - 10, spineY + lineOffset);
        ctx.stroke();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block absolute inset-0" />;
};
export default BookConstellationCanvas;
