import OpenAI from 'openai';
const fs = require('fs');
import path from 'path';

const jsonFilePath = './public/ngo.json';
const { GoogleGenerativeAI } = require("@google/generative-ai");



let genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);




export default function handler(req, res) {
    const { title, description } = req.body;



    const writeToJson = (datatoWrite)=>{
        fs.readFile(jsonFilePath, 'utf8', (err, data) => {
            if (err) {
              console.error('Error reading file:', err);
              return;
            }
            
            try {
              const jsonObject = JSON.parse(data);
              console.log(jsonObject["name"]);
              console.log(datatoWrite.name);
             jsonObject["name"] = datatoWrite.name;
             jsonObject["description"] = datatoWrite.description;
             jsonObject["mission"] = datatoWrite.mission;
             jsonObject["founder"] = datatoWrite.founder;  
             jsonObject["founder_description"] = datatoWrite.founder_description;  
             jsonObject["values"] = datatoWrite.values; 
             jsonObject["contact"] = datatoWrite.contact;   

             jsonObject["project_one_title"] = datatoWrite.project_one_title; 
             jsonObject["project_one_description"] = datatoWrite.project_one_description;   

             jsonObject["project_two_title"] = datatoWrite.project_two_title; 
             jsonObject["project_two_description"] = datatoWrite.project_two_description;

             jsonObject["project_three_title"] = datatoWrite.project_three_title; 
             jsonObject["project_three_description"] = datatoWrite.project_three_description;

             jsonObject["project_four_title"] = datatoWrite.project_four_title; 
             jsonObject["project_four_description"] = datatoWrite.project_four_description;

             jsonObject["project_five_title"] = datatoWrite.project_five_title; 
             jsonObject["project_five_description"] = datatoWrite.project_five_description;

             jsonObject["project_six_title"] = datatoWrite.project_six_title; 
             jsonObject["project_six_description"] = datatoWrite.project_six_description;

             fs.writeFile(jsonFilePath, JSON.stringify(jsonObject, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    // return res.status(500).json({ error: 'Failed to write to the JSON file.' });
                }
                console.log("added successfully");
            });
            //   console.log("trying to access the file")
            //   console.log(jsonObject);
            } catch (err) {
              console.error('Error parsing JSON:', err);
            }
          });
    }

    async function main(prompt) {

        try{
            console.log('Looking for JSON file at:', path.resolve(jsonFilePath)); 

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    
            
    
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
       

            let mainObject = JSON.parse(text);
            console.log(mainObject);

            
            
      
            
            return  mainObject;
        }catch(err){
            console.log(err);
            return "error either your prompt is against the guidelines or something went wrong";
        }
    }
    //message();
    const merge = async ()=>{
                let object1 = await main(`Extract the following details from the description of the NGO titled "${title}", here is the description ${description} and return them in a valid JSON format:
                    1. Description (max 620 characters)
                    2. Mission (max 150 characters)
                    3. Vision (max 150 characters)
                    4. Founder
                    5. Founder Description (max 250 characters)
                    6. values (max 10 values, each one must be under 10 words)
                    5. Contact details (Phone and Email)
                    8. Milestones (each one with a number and max 10 words)

                    Return the response in this exact JSON format (only return the json, no need to specify it is json and no need for backticks):
                    {
                        "name": "<value>",
                        "description": "<value>",
                        "mission": "<value>",
                        "vision": "<value>",
                        "founder": "<value>",
                        "founder_description":"<value>",
                        "values":"<value>"
                        "contact": {
                            "phone": "<value>",
                            "email": "<value>"
                        },
                        milestones:"<value>"
                    }
        `);

        let object2 =   await   main(`Extract the details of top 6 projects (each one's description should not be longer than 210 characters and it's title should not be longer than 25 characters, and if there are less than 6 then leave the rest with null) from the description of the NGO titled "${title}", here is the description ${description} and return them in a valid JSON format:
            Return the response in this exact JSON format (only return the json, no need to specify it is json and no need for backticks):
                    {   
                        "project_one_title":"<value>",
                        "project_one_description": "<value>",
                        "project_two_title":"<value>",
                        "project_two_description": "<value>",
                        "project_three_title":"<value>",
                        "project_three_description": "<value>",
                        "project_four_title":"<value>",
                        "project_four_description": "<value>",
                        "project_five_title":"<value>",
                        "project_five_description": "<value>",
                        "project_six_title":"<value>",
                        "project_six_description": "<value>"
                    }

        `);

        let newObject = {
        name:object1.name,
        description:object1.description,
        mission:object1.mission,
        vision:object1.vision,
        founder:object1.founder,
        founder_description:object1.founder_description,
        values:object1.values,
        contact:object1.contact,

        project_one_title:object2.project_one_title,
        project_one_description:object2.project_one_description,
        project_two_title:object2.project_two_title,
        project_two_description:object2.project_two_description,
        project_three_title:object2.project_three_title,
        project_three_description:object2.project_three_description,
        project_four_title:object2.project_four_title,
        project_four_description:object2.project_four_description,
        project_five_title:object2.project_five_title,
        project_five_description:object2.project_five_description,
        project_six_title:object2.project_six_title,
        project_six_description:object2.project_six_description
        };
        console.log(newObject);
        writeToJson(newObject);
        res.status(200).json({ message: `${newObject}` });
    }

    merge();
  }
  