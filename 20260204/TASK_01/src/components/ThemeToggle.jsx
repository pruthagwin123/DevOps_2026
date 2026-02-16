import React, { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Sync body data attribute so CSS can handle background & color
    document.body.dataset.theme = theme
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return (
    <div className={`theme-card ${theme}`}>
      <header className="theme-header">
        <h1 className="title">Talking Tom with Bed Lamp</h1>
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Click the lamp to turn the light on/off!</p>
      </header>

      <section style={{ marginTop: '1rem' }}>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>

        {/* Tom Scene with Lamp and Bed */}
        <div className="tom-scene-wrapper">
          <div className="bed-area">
            <div className="bed-frame">
              <div className="bed-mattress"></div>
              <div className="bed-pillow"></div>
            </div>

            {/* Tom Character - Real Image */}
            <div className={`tom-container ${theme}`}>
              <img
                src={theme === 'dark' ? "https://laurasambitiouswriting.wordpress.com/wp-content/uploads/2018/11/img_0741.jpg?w=825" : "https://media.tenor.com/qkUk8exOXu4AAAAM/talking-tom-bag.gif"}
                alt="Talking Tom"
                className={`tom-image ${theme === 'dark' ? 'sleeping' : 'awake'}`}
              />
              {theme === 'dark' && (
                <div className="tom-blanket"></div>
              )}
            </div>
          </div>

          {/* Bed Lamp - Next to Tom's Bed */}
          <button
            onClick={toggle}
            className={`lamp-button ${theme}`}
            title="Click to toggle light"
            aria-label="Toggle lamp light"
          >
            <img
              src="https://cdn.swadeshonline.com/v2/patient-paper-41f385/swad-p/wrkr/products/pictures/item/free/450x0/fUgF0ICNT25-00Base-(1).jpg"
              alt="Bed Lamp"
              className="bed-lamp-image"
            />
            <span className="lamp-label">{theme === 'dark' ? 'Turn On' : 'Turn Off'}</span>
          </button>
        </div>

        {/* Status Text */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '1rem', fontWeight: '600' }}>
          {theme === 'dark' ? 'Tom is sleeping... 😴' : 'Tom is awake! 😺'}
        </p>

        {/* Conditional rendering based on theme */}
        {theme === 'dark' ? (
          <div style={{ marginTop: 8 }}>
            <p>Lights off — Tom is sleeping, reduced glare and a sleek look 🌙</p>
          </div>
        ) : (
          <div style={{ marginTop: 8 }}>
            <p>Lights on — Tom is awake, bright and playful ☀️</p>
          </div>
        )}

        <hr style={{ margin: '1.25rem 0' }} />
      </section>
    </div>
  )
}
