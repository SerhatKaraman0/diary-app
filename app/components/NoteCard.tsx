"use client";
import Trash from "@/lib/assets/trash";
import { useRef, useEffect, useState, useCallback } from "react";
import { autoGrow, setZIndex } from "@/lib/utils";
import { Note } from "@/lib/types";

interface NoteCardProps {
    note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
    const [position, setPosition] = useState(() => {
        try {
            return JSON.parse(note.position);
        } catch {
            return { x: 0, y: 0 };
        }
    });
    
    const colors = (() => {
        try {
            return JSON.parse(note.colors);
        } catch {
            return { colorBody: "#FFFFFF", colorHeader: "#9bd1de", colorText: "#000000" };
        }
    })();
    
    const body = (() => {
        try {
            return JSON.parse(note.body);
        } catch {
            return note.body;
        }
    })();

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        autoGrow(textAreaRef);
    }, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setZIndex(cardRef.current);
        dragStartRef.current = { 
            x: e.clientX - position.x, 
            y: e.clientY - position.y 
        };
        setIsDragging(true);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        
        setPosition({
            x: e.clientX - dragStartRef.current.x,
            y: e.clientY - dragStartRef.current.y
        });
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <div
            ref={cardRef}
            className="scrapbook-card absolute flex flex-col overflow-hidden transition-none"
            style={{
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
                borderRadius: '8px 12px 10px 15px',
                transform: `rotate(${(position.x + position.y) % 2 === 0 ? -1 : 1}deg)`,
                width: '300px',
                minHeight: '200px',
                zIndex: isDragging ? 999 : undefined,
                position: 'absolute'
            }}
        >
            <div
                onMouseDown={handleMouseDown}
                className="washi-tape cursor-move flex items-center justify-between px-3"
                style={{
                    backgroundColor: colors.colorHeader,
                    opacity: 1,
                    height: '28px'
                }}
            >
                <div className="typewriter text-[9px] text-white/70 font-bold tracking-widest">STATIONERY</div>
                <button className="hover:scale-110 transition-transform p-1">
                    <Trash color={colors.colorText} />
                </button>
            </div>
            <div
                className="flex-1 p-5 handwriting"
                style={{
                    color: colors.colorText,
                }}
            >
                <textarea
                    ref={textAreaRef}
                    style={{ color: colors.colorText }}
                    defaultValue={body}
                    onInput={() => {
                        autoGrow(textAreaRef);
                    }}
                    onFocus={() => {
                        setZIndex(cardRef.current);
                    }}
                    className="w-full h-full bg-transparent border-none focus:outline-none resize-none leading-relaxed"
                    placeholder="Type your thoughts..."
                ></textarea>
            </div>
            <div className="px-4 py-2 flex justify-end opacity-20">
                <div className="w-3 h-3 rounded-full border-2 border-current" />
            </div>
        </div>
    );
};

export default NoteCard;
