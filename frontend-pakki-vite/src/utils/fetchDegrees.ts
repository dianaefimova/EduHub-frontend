// src/utils/fetchDegrees.ts

export interface Course {
    course_id: string;
    course_name: string;
    credits: number;
  }
  
  export interface Degree {
    id: number;
    name: string;
    level: string;
    years: number;
    credits: number;
    curriculum: Course[];
  }
  
  // Function to fetch degrees data from the provided URL
  export const fetchDegrees = async (): Promise<Degree[]> => {
    const response = await fetch('https://mocki.io/v1/4f048e3a-052a-40cd-803e-296d54b99ed9');
    const data = await response.json();
    console.log(data.degrees);
    return data.degrees;
  };
  
  // Function to get a specific degree by ID
  export const getDegreeById = async (id: number): Promise<Degree | undefined> => {
    const degrees = await fetchDegrees();
    console.log(degrees);
    return degrees.find((degree) => degree.id === id);
  };

  export const fetchCourseName = async (degreeId: number, courseId: string): Promise<string | undefined> => {
    const degree = await getDegreeById(degreeId);
    const course = degree?.curriculum.find((course) => course.course_id === courseId);
    return course?.course_name;
  }
  