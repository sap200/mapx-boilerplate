// Initialize the Cesium Viewer with ellipsoid terrain (no token needed)
const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    timeline: false,
    animation: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    baseLayerPicker: true,
    geocoder: false,
});

// Enable space-like environment
viewer.scene.skyBox.show = true;
viewer.scene.skyAtmosphere.show = true;
viewer.scene.backgroundColor = Cesium.Color.BLACK;
viewer.scene.globe.enableLighting = true;
viewer.scene.screenSpaceCameraController.enableRotate = true;
viewer.scene.screenSpaceCameraController.enableZoom = true;

// List of multiple GeoJSON border files to load
const geojsonFiles = [
    { url: 'data.json', stroke: Cesium.Color.RED },
    { url: 'data2.json', stroke: Cesium.Color.BLUE },
    { url: 'data3.json', stroke: Cesium.Color.GREEN }
];

// Load all GeoJSON files in parallel
Promise.all(
    geojsonFiles.map(({ url, stroke }) =>
        Cesium.GeoJsonDataSource.load(url, {
            stroke: stroke,
            fill: Cesium.Color.YELLOW.withAlpha(0.2),
            strokeWidth: 2
        })
    )
).then(dataSources => {
    // Add each data source to the viewer
    dataSources.forEach(ds => viewer.dataSources.add(ds));

    // Combine all entities from all data sources
    const allEntities = new Cesium.EntityCollection();
    dataSources.forEach(ds => {
        ds.entities.values.forEach(entity => allEntities.add(entity));
    });

    // Compute bounding sphere to fly camera around all loaded borders
    const boundingSphere = allEntities.computeBoundingSphere();

    if (boundingSphere) {
        const center = boundingSphere.center;
        const cartographic = Cesium.Cartographic.fromCartesian(center);

        // Fly to bounding sphere center with enough altitude and pitch for better camera control
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromRadians(
                cartographic.longitude,
                cartographic.latitude,
                Math.max(boundingSphere.radius * 5, 300000) // At least 300 km altitude or radius*5
            ),
            orientation: {
                heading: 0.0,
                pitch: Cesium.Math.toRadians(-30), // look slightly down
                roll: 0.0
            },
            duration: 3,
        });
    }
});

// === CKEditor Integration ===

// Create and style text pad container dynamically
const textPad = document.createElement('div');
textPad.id = 'textPad';
Object.assign(textPad.style, {
    display: 'none',
    position: 'absolute',
    width: '400px',
    height: '300px',
    background: 'white',
    border: '1px solid #ccc',
    padding: '10px',
    zIndex: '10',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    borderRadius: '5px',
    overflow: 'auto',
    fontFamily: 'Arial, sans-serif'
});
document.body.appendChild(textPad);

// Header with close button
const header = document.createElement('div');
header.style.display = 'flex';
header.style.justifyContent = 'space-between';
header.style.alignItems = 'center';
header.style.marginBottom = '10px';

const title = document.createElement('h3');
title.innerText = 'Notes for Location';
title.style.margin = '0';

const closeBtn = document.createElement('button');
closeBtn.innerText = 'X';
Object.assign(closeBtn.style, {
    cursor: 'pointer',
    background: '#f44336',
    border: 'none',
    color: 'white',
    padding: '3px 8px',
    borderRadius: '3px',
    fontWeight: 'bold',
});

header.appendChild(title);
header.appendChild(closeBtn);
textPad.appendChild(header);

// Editor container
const editorContainer = document.createElement('div');
editorContainer.id = 'editor';
editorContainer.style.height = '240px'; // leave some space for header
textPad.appendChild(editorContainer);

// Initialize CKEditor
let editorInstance = null;
ClassicEditor.create(editorContainer)
    .then(editor => {
        editorInstance = editor;
    })
    .catch(error => {
        console.error('CKEditor init error:', error);
    });

// Close button hides the text pad
closeBtn.addEventListener('click', () => {
    textPad.style.display = 'none';
});

// On globe click: show textPad near mouse and load clicked coords and reposition camera properly
viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(click) {
    const pickedPosition = viewer.scene.pickPosition(click.position);
    if (Cesium.defined(pickedPosition)) {
        const cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
        const lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
        const lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);

        // Reset any previous camera lookAt transform to free camera controls
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

        // Camera target: clicked point
        const target = pickedPosition;

        // Offset camera 500 km above the point to allow smooth rotation and zoom
        const offset = new Cesium.Cartesian3(0.0, 0.0, 500000.0);

        // Use lookAt to position camera looking at the clicked location with offset
        viewer.camera.lookAt(target, offset);

        // Position textPad near mouse click with a little offset
        const canvasRect = viewer.canvas.getBoundingClientRect();
        textPad.style.top = (click.position.y + canvasRect.top + 10) + 'px';
        textPad.style.left = (click.position.x + canvasRect.left + 10) + 'px';

        // Show the textPad
        textPad.style.display = 'block';

        // Set initial content in editor with lat/lon info
        if (editorInstance) {
            editorInstance.setData(`
                <p><strong>Location:</strong> Longitude: ${lon}, Latitude: ${lat}</p>
                <p>Write your notes here...</p>
            `);
        }

        console.log(`Clicked at Longitude: ${lon}, Latitude: ${lat}`);
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
