"use client";
import HelixImage from '../assets/images/helix2.png';
import EmojiImage from '../assets/images/emojistar.png';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaChevronRight } from 'react-icons/fa';
import { useState, useRef } from 'react';
import Modal from './Waitlist.jsx'; // Import the Modal (Waitlist) component

export const CallToAction = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // TypeScript fix: specify the type of event
  const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-black text-white py-[72px] sm:py-24" ref={containerRef}>
      <div className="container max-w-xl relative">
        <motion.div style={{ translateY }}>
          <Image src={HelixImage} alt="helix" className="absolute top-6 left-[calc(100%+36px)]" />
        </motion.div>
        <motion.div style={{ translateY }}>
          <Image src={EmojiImage} alt="emoji" className="absolute -top-[120px] right-[calc(100%+30px)]" />
        </motion.div>

        <h2 className="font-bold text-5xl sm:text-6xl tracking-tighter">Recalla Pro Waitlist</h2>
        <p className="text-xl text-white/70 mt-5">
          Join hundreds of users that are anticipating being part of Recalla Pro set for release soon. Are you <i>flashcard game?</i>
        </p>
        <form className="mt-10 flex flex-col gap-2.5 max-w-sm mx-auto sm:flex-row">
          <input
            type="email"
            placeholder="bmmunga@outlook.com"
            className="h-12 bg-white/20 rounded-lg px-5 font-medium placeholder:text-[#9CA3AF] sm:flex-1"
          />
          <button
            type="submit"
            className="group inline-flex items-center justify-center text-center text-sm leading-loose bg-purple-500 text-black h-12 rounded-lg px-5"
            onClick={handleOpenModal}
          >
            ✨ <span className="font-bold">Join Waitlist</span> <FaChevronRight className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
          </button>
        </form>
      </div>

      {/* Render the Modal (Waitlist) component */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};
