import React from 'react';
import { QRCode } from 'react-qrcode-logo';

const BrandedQRCode = ({ token }) => {
  if (!token) return <p>Loading QR Code...</p>;
  return (
    <div style={styles.qrContainer}>
      <QRCode
        value={token}
        size={250}
        logoImage="/images/IntelliCampusLogo.png" // Update this path to your actual logo
        logoWidth={60}
        logoHeight={60}
        removeQrCodeBehindLogo={true} 
        logoPadding={10}
        logoPaddingStyle="circle"
        qrStyle="dots"
        eyeRadius={10}
        fgColor="#1A365D"
        bgColor="#FFFFFF"
        ecLevel="H"
      />
    </div>
  );
};

const styles = {
  qrContainer: {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default BrandedQRCode;
