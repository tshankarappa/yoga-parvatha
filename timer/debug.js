// Debug module
const DEBUG_MODE = false;

function createDebugPanel() {
    const debugDiv = document.createElement('div');
    debugDiv.id = 'debug';
    debugDiv.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 10px;
        font-family: monospace;
        font-size: 12px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 9999;
        display: none;
    `;
    document.body.appendChild(debugDiv);
    return debugDiv;
}

function debug(msg) {
    if (!DEBUG_MODE) return;
    
    let debugDiv = document.getElementById('debug');
    if (!debugDiv) {
        debugDiv = createDebugPanel();
    }
    
    const timestamp = new Date().toLocaleTimeString();
    const message = `[${timestamp}] ${msg}`;
    
    debugDiv.style.display = 'block';
    debugDiv.innerHTML += message + '<br>';
    debugDiv.scrollTop = debugDiv.scrollHeight;
}

// Export the debug function
export { debug, DEBUG_MODE }; 