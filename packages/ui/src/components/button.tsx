export const Button = () => {
  return (
    <button>
      <span></span>
      <span
        aria-hidden
        className="absolute inset-0 top-[50%] h-full w-full will-change-transform before:absolute before:left-0"
      />
    </button>
  );
};
