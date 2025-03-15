import Trash from "@/lib/assets/trash";
import { useRef, useEffect, useState } from "react";
import { autoGrow, setNewOffset, setZIndex } from "@/lib/utils";

interface Note {
    position: string;
    colors: string;
    body: string;
}

const NoteCard = ({ note }: { note: Note }) => {
    const [position, setPosition] = useState(JSON.parse(note.position));
    const colors = JSON.parse(note.colors);
    const body = JSON.parse(note.body);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        autoGrow(textAreaRef);
    }, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setZIndex(cardRef.current);
        setIsDragging(true);
        setDragStart({ 
            x: e.clientX - position.x, 
            y: e.clientY - position.y 
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={cardRef}
            className="card absolute"
            style={{
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            <div
                onMouseDown={handleMouseDown}
                className="card-header cursor-move"
                style={{
                    backgroundColor: colors.colorHeader,
                }}
            >
                <Trash />
            </div>
            <div
                className="card-body"
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
                ></textarea>
            </div>
        </div>
    );
};

export default NoteCard;
