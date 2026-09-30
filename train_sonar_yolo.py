from ultralytics import YOLO

def train_sonar_model():
    print("Initializing YOLOv8 Nano model for Sonar Transfer Learning...")
    
    # 1. Load the base pre-trained model (trained on COCO)
    # We use YOLOv8n (nano) because it is extremely fast and can run on marine edge devices (like Raspberry Pi)
    model = YOLO('yolov8n.pt')
    
    print("Starting training process...")
    # 2. Train the model on your custom dataset
    # You will need a 'data.yaml' file that points to your images and labels.
    # Replace 'path/to/sonar_dataset/data.yaml' with the actual path to your downloaded dataset.
    results = model.train(
        data='D:/BTECH/SIH26/PS_57Prototype/train-20260929T224508Z-1-001/data.yaml',         # Path to dataset configuration file
        epochs=1,                 # Run for 1 epoch just to verify it works locally
        imgsz=640,                # Resize sonar images to 640x640 for consistency
        batch=4,                  # Smaller batch size for local testing
        device='',                # Leave empty to auto-select GPU if available, else CPU
        optimizer='auto',         # Automatically select best optimizer (usually AdamW or SGD)
        patience=30,              # Early stopping: stop if accuracy doesn't improve for 30 epochs
        lr0=0.001,                # Initial learning rate
        name='sonar_debris_model' # Directory name where the best.pt weights will be saved
    )
    
    print("Training complete!")
    print("Your optimized model weights are saved at: runs/detect/sonar_debris_model/weights/best.pt")
    
if __name__ == '__main__':
    train_sonar_model()
