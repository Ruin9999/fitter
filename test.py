import base64
from openai import OpenAI

client = OpenAI()

# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

assistantPrompt = """
You are a detailed fashion assistant. 
Given the attached image of a single clothing item, describe it as thoroughly yet succinctly as possible. 
Include the type of garment, color, pattern, fabric, notable design features, and any apparent style or intended use. 
Avoid guessing the brand or unrelated details. 
Provide just enough information so someone could envision the clothing item clearly from your description.
""";

# Path to your image
image_path = "test.jpg"

# Getting the Base64 string
base64_image = encode_image(image_path)

assistantPrompt = "Your assistant prompt here"  # Define assistantPrompt variable

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages = [
      { "role": "developer", "content": assistantPrompt },
      { "role": "user",   "content": [
        { "type": "text", "text": "Here's an image of a piece of clothing." },
        { "type": "image_url", "image_url": { "url": f"data:image/jpeg;base64,{base64_image}"}}
      ]}
    ]
)

print(response.choices[0].message.content)