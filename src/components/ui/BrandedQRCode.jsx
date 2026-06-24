import React from 'react';
import { QRCode } from 'react-qrcode-logo';

const BrandedQRCode = ({ token }) => {
  if (!token) return <p>Loading QR Code...</p>;
  return (
    <div style={styles.qrContainer}>
      <QRCode
        value={token}
        size={250}
        logoImage="/images/IntelliCampusLogo.png"
        logoWidth={60}
        logoHeight={60}
        removeQrCodeBehindLogo={true} 
        logoPadding={10}
        logoPaddingStyle="circle"
        qrStyle="fluid"
        eyeRadius={10}
        fgColor="#313d52"
        bgColor="#FFFFFF"
        ecLevel="H"
      />
    </div>
  );
};

const styles = {
  qrContainer: {
    padding: '10px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default BrandedQRCode;
