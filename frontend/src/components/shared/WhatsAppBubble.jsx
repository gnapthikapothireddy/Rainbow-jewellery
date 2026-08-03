import React from 'react';

export default function WhatsAppBubble() {
  const number = '919999999999';
  const text = encodeURIComponent("Hello Rainbow Jewelry support! I am interested in customizable bridal packages.");
  const url = `https://wa.me/${number}?text=${text}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform hover:shadow-green-500/30"
      title="Chat with us on WhatsApp"
    >
      <svg
        className="w-8 h-8 text-white fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.031 2c-5.514 0-9.989 4.477-9.989 9.99 0 2.012.597 3.88 1.621 5.456l-1.662 6.07 6.22-1.632a9.92 9.92 0 0 0 3.81 1.096h.004c5.51 0 9.985-4.476 9.985-9.989 0-5.515-4.475-9.991-9.989-9.991zm6.59 13.905c-.266.753-1.353 1.378-1.85 1.488-.49.108-1.12.185-3.076-.607-2.502-1.01-4.103-3.555-4.227-3.722-.124-.165-1.002-1.332-1.002-2.54 0-1.21.63-1.803.856-2.046.225-.243.493-.304.658-.304.165 0 .33.003.473.01.147.007.347-.056.544.423.2.493.684 1.67.743 1.792.06.12.09.262.01.423-.08.16-.17.26-.26.368-.09.107-.19.224-.27.307-.1.1-.2.21-.086.4.114.19.507.836 1.09 1.355.75.67 1.383.876 1.577.973.193.1.306.083.42-.047.114-.13.49-.57.62-.764.13-.193.26-.162.437-.097.177.065 1.13.533 1.323.63.193.097.323.143.37.225.047.082.047.476-.118 1.23z" />
      </svg>
    </a>
  );
}
