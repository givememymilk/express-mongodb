import User from '../models/users.ts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Test endpoint
export async function test(req: any, res: any, next: any) {
  try {
    res.send('Greetings from the Test controller!');
  } catch (err) {
    next(err);
  }
}

// SIGNUP - Register a new user
export async function user_signup(req: any, res: any, next: any) {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();



    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (err) {
    next(err);
  }
}

// LOGIN - Authenticate user
export async function user_login(req: any, res: any, next: any) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Successfully logged in',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
}

// READ - Get user by ID
export async function user_details(req: any, res: any, next: any) {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// UPDATE - Update user by ID
export async function user_update(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach payload to request
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  try {
    const updateData = { ...req.body };
    delete updateData.password; // Don't allow password update via this endpoint

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      message: 'User updated successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

// DELETE - Delete user by ID
export async function user_delete(req: any, res: any, next: any) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
}