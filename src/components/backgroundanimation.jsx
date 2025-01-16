const BackgroundAnimation = () => {
  return (
    <div className="absolute inset-0">
      {/* Multiple Stars */}
      {Array.from({ length: 50 }).map((_, index) => (
        <div
          key={index}
          className="absolute bg-white rounded-full w-1 h-1 animate-twinkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        ></div>
      ))}
      {/* Meteor Animation */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="absolute w-1 h-1 bg-gradient-to-tr from-white to-transparent rounded-full animate-meteor"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${2 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default BackgroundAnimation;
