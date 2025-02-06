"use client";
import React from "react";

interface Props extends React.PropsWithChildren {
    className?: string;
    isPublic?: boolean;
    date?: string;
    day?: string;
    month?: string;
    totalDayIndex?: number;
    onClose: () => void;
}

const DateModal: React.FC<Props> = ({
    className = "",
    isPublic,
    date,
    day,
    month,
    totalDayIndex,
    onClose,
}) => {
    return (
        <>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Date Details</h3>
                    <p className="py-4">Day: {day}</p>
                    <p className="py-4">Month: {month}</p>
                    <p className="py-4">Total Day Index: {totalDayIndex}</p>
                    <div className="modal-action">
                        <button className="btn" onClick={onClose}>Close</button>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default DateModal;