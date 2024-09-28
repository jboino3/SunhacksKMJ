import React from 'react';

function HomePage() {
  const items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

  return (
    <div>
      <h2>Home Page</h2>
      <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid black' }}>
        {items.map((item, index) => (
          <div key={index} style={{ padding: '10px', borderBottom: '1px solid gray' }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
