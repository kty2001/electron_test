# Electron Image Classification Test

## Install 
```bash
conda env create -f environment.yml
```
Download 'yolo11n-cls.pt' in ultralytics model zoo and put it in the backend folder.

If there is not `package.json`, run following command in root directory(elecbuilder_test)
```bash
npm install electron --save-dev
npm install electron-builder --save-dev
```
If not run npm, try first
```bash
conda install nodejs
```

## Run

#### Electron
Run in root directory
```bash
npm start
```

#### Electron-builder
Run in root directory
```bash
npm run build
```
And then, check `frontend/dist` directory