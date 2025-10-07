import { Request, Response } from 'express';
import Subject from '../models/Subject';

// Get subjects by department and year
export const getSubjectsByDeptYear = async (req: Request, res: Response): Promise<void> => {
  try {
    const { department, year } = req.params;

    const subjects = await Subject.find({ department, year });

    res.status(200).json({
      success: true,
      data: subjects
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching subjects'
    });
  }
};

// Get all subjects
export const getAllSubjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const subjects = await Subject.find();

    res.status(200).json({
      success: true,
      data: subjects
    });
  } catch (error) {
    console.error('Get all subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching subjects'
    });
  }
};

// Create a new subject (admin only)
export const createSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code, department, year, description } = req.body;

    const subject = new Subject({
      name,
      code,
      department,
      year,
      description
    });

    await subject.save();

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject
    });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating subject'
    });
  }
};
