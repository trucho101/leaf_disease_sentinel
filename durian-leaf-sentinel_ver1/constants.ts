
import { DiseaseInfo } from './types';

export const DISEASE_CLASSES = ["Healthy", "Anthracnose", "Leaf Blight", "Sooty Mold", "Dieback"];

export const DISEASE_INFO: { [key: string]: DiseaseInfo } = {
  "Healthy": {
    name: "Healthy",
    description: "The leaf is free from any signs of disease and exhibits normal color and growth.",
    symptoms: ["Vibrant green color", "No spots or lesions", "Intact leaf margins"],
    management: ["Maintain proper nutrition and watering schedules.", "Ensure good air circulation around the plants.", "Regularly monitor for any early signs of pests or diseases."]
  },
  "Anthracnose": {
    name: "Anthracnose",
    description: "A fungal disease caused by Colletotrichum species, which affects leaves, stems, and fruits. It is common in warm, humid conditions.",
    symptoms: ["Small, dark, sunken spots on leaves.", "Spots may enlarge and develop a 'target' appearance.", "In severe cases, leaves may wither and drop prematurely."],
    management: ["Prune and destroy infected plant parts.", "Apply appropriate fungicides, especially during wet seasons.", "Improve air circulation to reduce humidity around the foliage."]
  },
  "Leaf Blight": {
    name: "Leaf Blight",
    description: "Caused by various fungi, Leaf Blight leads to rapid browning and death of leaf tissue, often starting from the tips or margins.",
    symptoms: ["Large, irregular-shaped brown or black patches on leaves.", "Lesions may be surrounded by a yellow halo.", "Affected leaves often curl, wither, and die."],
    management: ["Remove and dispose of infected leaves.", "Avoid overhead watering to keep foliage dry.", "Use copper-based or other recommended fungicides as a preventive measure."]
  },
  "Sooty Mold": {
    name: "Sooty Mold",
    description: "A black, powdery coating on leaves, caused by fungi that grow on 'honeydew', a sugary substance excreted by sap-sucking insects like aphids or scale.",
    symptoms: ["Black, soot-like growth on the leaf surface.", "Can block sunlight, reducing photosynthesis.", "Presence of insects like aphids, mealybugs, or scale insects."],
    management: ["Control the underlying insect pest infestation with insecticidal soap or neem oil.", "Gently wash the sooty mold off the leaves with a mild soap and water solution.", "Promote beneficial insects that prey on pests."]
  },
  "Dieback": {
    name: "Dieback",
    description: "A condition where branches and shoots die from the tip backward, often caused by fungal pathogens or environmental stress.",
    symptoms: ["Progressive death of twigs and branches, starting from the tips.", "Leaves on affected branches turn yellow, wilt, and drop.", "Discoloration of the wood beneath the bark."],
    management: ["Prune affected branches well below the diseased area.", "Improve soil drainage and overall plant health.", "Apply fungicides to protect pruning wounds and prevent further infection."]
  }
};
