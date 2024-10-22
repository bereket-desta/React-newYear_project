import React, { useRef, useEffect } from 'react';
import './Firework.css';

const FireworksCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let fireworks = [];
        let particles = [];
        let hue = 120;
        let limiterTotal = 5;
        let limiterTick = 0;
        let timerTotal = 80;
        let timerTick = 0;
        let cw = window.innerWidth;
        let ch = window.innerHeight;
        let mousedown = false;
        let mx;
        let my;

        canvas.width = cw;
        canvas.height = ch;

        function random(min, max) {
            return Math.random() * (max - min) + min;
        }

        function calculateDistance(p1x, p1y, p2x, p2y) {
            let xDistance = p1x - p2x;
            let yDistance = p1y - p2y;
            return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
        }

        function Firework(sx, sy, tx, ty) {
            this.x = sx;
            this.y = sy;
            this.sx = sx;
            this.sy = sy;
            this.tx = tx;
            this.ty = ty;
            this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
            this.distanceTraveled = 0;
            this.coordinates = [];
            this.coordinateCount = 5;
            while (this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }
            this.angle = Math.atan2(ty - sy, tx - sx);
            this.speed = 3;
            this.acceleration = 1.5;
            this.brightness = random(20, 70);
            this.targetRadius = 5;
        }

        Firework.prototype.update = function (index) {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);
            if (this.targetRadius < 20) {
                this.targetRadius += 0.5;
            } else {
                this.targetRadius = 1;
            }

            this.speed *= this.acceleration;
            const vx = Math.cos(this.angle) * this.speed;
            const vy = Math.sin(this.angle) * this.speed;
            this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

            if (this.distanceTraveled >= this.distanceToTarget) {
                createParticles(this.tx, this.ty);
                fireworks.splice(index, 1);
            } else {
                this.x += vx;
                this.y += vy;
            }
        };

        Firework.prototype.draw = function () {
            ctx.beginPath();
            ctx.moveTo(
                this.coordinates[this.coordinates.length - 1][0],
                this.coordinates[this.coordinates.length - 1][1]
            );
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = `hsl(${hue}, 100%, ${this.brightness}%)`;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
            ctx.stroke();
        };

        function Particle(x, y) {
            this.x = x;
            this.y = y;
            this.coordinates = [];
            this.coordinateCount = 5;
            while (this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }
            this.angle = random(0, Math.PI * 2);
            this.speed = random(1, 10);
            this.friction = 0.9;
            this.gravity = 1;
            this.hue = random(hue - 50, hue + 50);
            this.alpha = 1;  // Initialize alpha here
            this.decay = random(0.015, 0.03);
        }

        Particle.prototype.update = function (index) {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);
            this.speed *= this.friction;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            this.alpha -= this.decay;

            if (this.alpha <= this.decay) {
                particles.splice(index, 1);
            }
        };

        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.moveTo(
                this.coordinates[this.coordinates.length - 1][0],
                this.coordinates[this.coordinates.length - 1][1]
            );
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
            ctx.stroke();
        };

        function createParticles(x, y) {
            let particleCount = 30;
            while (particleCount--) {
                particles.push(new Particle(x, y));
            }
        }

        function update() {
            requestAnimationFrame(update);
            hue = random(0, 360);

            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, cw, ch);
            ctx.globalCompositeOperation = "lighter";

            let i = fireworks.length;
            while (i--) {
                fireworks[i].draw();
                fireworks[i].update(i);
            }

            let j = particles.length;
            while (j--) {
                particles[j].draw();
                particles[j].update(j);
            }

            if (timerTick >= timerTotal) {
                if (!mousedown) {
                    fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2)));
                    timerTick = 0;
                }
            } else {
                timerTick++;
            }

            if (limiterTick >= limiterTotal) {
                if (mousedown) {
                    fireworks.push(new Firework(cw / 2, ch, mx, my));
                    limiterTick = 0;
                }
            } else {
                limiterTick++;
            }
        }

        canvas.addEventListener("mousemove", (e) => {
            mx = e.pageX - canvas.offsetLeft;
            my = e.pageY - canvas.offsetTop;
        });

        canvas.addEventListener("mousedown", (e) => {
            e.preventDefault();
            mousedown = true;
        });

        canvas.addEventListener("mouseup", (e) => {
            e.preventDefault();
            mousedown = false;
        });

        window.addEventListener("resize", () => {
            cw = window.innerWidth;
            ch = window.innerHeight;
            canvas.width = cw;
            canvas.height = ch;
        });

        update();
    }, []);

    return (
        <canvas ref={canvasRef} id="fireworksCanvas"></canvas>
    );
};

export default FireworksCanvas;
