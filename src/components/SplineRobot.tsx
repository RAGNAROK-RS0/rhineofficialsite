import { useRef, useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Application, SPEObject } from '@splinetool/runtime';

export default function SplineRobot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const splineAppRef = useRef<Application | null>(null);
  const headObjectRef = useRef<SPEObject | null>(null);
  const [sectionElement, setSectionElement] = useState<HTMLElement | null>(null);

  // Find the #technology section
  useEffect(() => {
    if (!containerRef.current) return;
    let parent = containerRef.current.parentElement;
    while (parent) {
      if (parent.tagName === 'SECTION' && parent.id === 'technology') {
        setSectionElement(parent);
        break;
      }
      parent = parent.parentElement;
    }
  }, []);

  const findHeadObject = (app: Application): SPEObject | null => {
    const allObjects = app.getAllObjects();
    const headNames = ['Head', 'head', 'Neck', 'neck', 'RobotHead', 'robot_head'];
    return allObjects.find(obj => headNames.includes(obj.name)) || null;
  };

  useEffect(() => {
    const section = sectionElement;
    const robotContainer = containerRef.current;
    if (!section || !robotContainer) return;

    const handleMove = (clientX: number, clientY: number) => {
      if (!headObjectRef.current) return;

      const rect = robotContainer.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const isOverRobot =
        clientX >= rect.left && clientX <= rect.right &&
        clientY >= rect.top && clientY <= rect.bottom;
      if (!isOverRobot) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = (clientX - centerX) / (rect.width / 2);
      const offsetY = (clientY - centerY) / (rect.height / 2);

      const maxYaw = Math.PI / 3;      // 60°
      const maxPitch = Math.PI / 4;    // 45°

      let yaw = Math.atan2(offsetX, 1) * (maxYaw / (Math.PI / 2));
      let pitch = Math.atan2(offsetY, 1) * (maxPitch / (Math.PI / 2));

      yaw = Math.min(maxYaw, Math.max(-maxYaw, yaw));
      pitch = Math.min(maxPitch, Math.max(-maxPitch, pitch));

      headObjectRef.current.rotation.y = yaw;
      headObjectRef.current.rotation.x = -pitch;
    };

    const resetHead = () => {
      if (headObjectRef.current) {
        headObjectRef.current.rotation.y = 0;
        headObjectRef.current.rotation.x = 0;
      }
    };

    // Wrapped event handlers to store references
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    section.addEventListener('mousemove', onMouseMove);
    section.addEventListener('mouseleave', resetHead);
    section.addEventListener('touchmove', onTouchMove);
    section.addEventListener('touchend', resetHead);

    return () => {
      section.removeEventListener('mousemove', onMouseMove);
      section.removeEventListener('mouseleave', resetHead);
      section.removeEventListener('touchmove', onTouchMove);
      section.removeEventListener('touchend', resetHead);
    };
  }, [sectionElement]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[200px]">
      <Spline
        scene="https://prod.spline.design/3c3rOBJxzYuK8lDA/scene.splinecode"
        className="w-full h-full"
        onLoad={(splineApp) => {
          splineAppRef.current = splineApp;
          const head = findHeadObject(splineApp);
          if (head) {
            headObjectRef.current = head;
            console.log('✅ Robot head found – exact tracking enabled');
          } else {
            console.warn(
              '⚠️ No head object named "Head" found. Please rename your head group to "Head" in Spline editor.'
            );
          }
        }}
      />
      <img
        src="https://cdn.prod.website-files.com/6501f1891917bde75ab542ee/653e8be9ae6bc59344b62ff3_robot-phunk%201.webp"
        alt="Robot"
        className="absolute inset-0 w-full h-full object-contain opacity-0 pointer-events-none"
      />
    </div>
  );
}