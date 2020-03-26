import React, { useState } from "react";
import { Alert } from "react-bootstrap";

function AlertDismissible({ message, type, onClose }) {
    const [show, setShow] = useState(true);
    if (show) {
        {
            window.setTimeout(() => onClose(), 3000);
        }
        return (
            <Alert
                variant={type}
                onClose={() => {
                    onClose();
                }}
                dismissible
            >
                {message}
            </Alert>
        );
    }
    return <div></div>;
}
export default AlertDismissible;
