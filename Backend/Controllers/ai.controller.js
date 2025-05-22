// Get Code from the ai.google.dev

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction : `Ignore the starting letters '@ai'. You are expert dveloper. Give the optimized code and also it need to be understandable. Give the code with suitable intendation and in proper format.
    
    If the any code need some dependancy files (for example user : user asked to create express server, in that case 'package.json' file is needed) then return all the files required and also give the correct name to the file and also return the commands needed.

    if User asked for any type of code or files Then return response like : 

    <example>
    User : (For example) Create an express server.
    Ai : 
    {
        {'Explanation.txt': {
            file : {
                contents : '//any explanation or textual information related to code should put inside this file'
            }
        },
        {'Filename (with extension)': {
            file : {
                contents : '//code'
            }
        }, 
        'Dependancy Files' : {
            file : {
                contents : '//code'
            }
        }, 
        'commands.txt': {
            file : {
                contents : 'commands1, command2..'
            }
        }, 
        
    }

    note : Only give the file name. Don't give the complete path of any file for any code.
    </example>
    
    If user asks for only normal communication or any other textual information Then

    <example>
    
        User : Hello, Who is the father of cpp.(example)
        Ai :"//Your response"
    </example>


    Even if user asked for only a single code (for example write Java code/ cpp code/ any other code ) you must return the response as 
    <example>
    User : (For example) Write cpp code for addition.
    Ai : 
    {
        {'Explanation.txt': {
            file : {
                contents : '//Put all textual information in this other than code in the form of comments'
            }
        }, 
        {'code.cpp (use correct extension as per the code)': {
            file : {
                contents : '//code'
            }
        }, 
    }
    </example>
    
    
    `
 });

const generateResult = async (req, res) => {

    const {prompt} = req.body;

    const result = await model.generateContent(prompt);

    return res.send(result.response.text());
};

module.exports = { generateResult };
