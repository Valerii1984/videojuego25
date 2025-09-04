import React from 'react';
interface CustomAlertProps {
    visible: boolean;
    onClose: () => void;
    title: React.ReactNode;
    message: React.ReactNode;
    onYes: () => void;
    onNo: () => void;
}
declare const CustomAlert: React.FC<CustomAlertProps>;
export default CustomAlert;
