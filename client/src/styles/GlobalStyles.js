import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';

// Global styles
export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
  
  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }
`;

// Animations
export const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

// Common styled components
export const Button = styled(motion.button)`
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  border-radius: 50px;
  background: linear-gradient(45deg, #00dbde, #fc00ff);
  color: white;
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: none;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #fc00ff, #00dbde);
    transition: all 0.6s ease;
    z-index: -1;
  }
  
  &:hover::before {
    left: 0;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

// Export all styled components
export const Styled = {
  HeroSection: styled.section`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
    color: white;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  `,
  
  FloatingContainer: styled.div`
    text-align: center;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `,
  
  Title: styled(motion.h1)`
    font-size: 4rem;
    margin-bottom: 1.5rem;
    background: linear-gradient(90deg, #00dbde, #fc00ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 10px rgba(0, 219, 222, 0.5);
    font-weight: 800;
    letter-spacing: 2px;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  `,
  
  Subtitle: styled(motion.p)`
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: #e0e0e0;
    max-width: 800px;
    line-height: 1.6;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  `,
  
  NavBar: styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1.5rem 0;
    z-index: 1000;
    background: rgba(15, 12, 41, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  `,
  
  NavContainer: styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    
    @media (max-width: 768px) {
      flex-direction: column;
      padding: 1rem;
    }
  `,
  
  NavLinks: styled.div`
    display: flex;
    gap: 1.5rem;
    
    @media (max-width: 768px) {
      margin-top: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }
  `,
  
  NavLink: styled(motion.a)`
    color: white;
    text-decoration: none;
    margin: 0 1rem;
    font-size: 1.1rem;
    position: relative;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: all 0.3s ease;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #00dbde, #fc00ff);
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }
    
    &:hover::after {
      width: 80%;
    }
    
    &:hover {
      color: #00dbde;
      text-shadow: 0 0 10px rgba(0, 219, 222, 0.5);
    }
  `,
  
  Logo: styled(motion.div)`
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(90deg, #00dbde, #fc00ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    cursor: pointer;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  `,
  
  FloatingShape: styled.div`
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(45deg, rgba(0, 219, 222, 0.1), rgba(252, 0, 255, 0.1));
    filter: blur(60px);
    z-index: 0;
    
    &:nth-child(1) {
      width: 300px;
      height: 300px;
      top: -100px;
      left: -100px;
      animation: ${float} 15s ease-in-out infinite;
    }
    
    &:nth-child(2) {
      width: 200px;
      height: 200px;
      bottom: -50px;
      right: -50px;
      animation: ${float} 12s ease-in-out infinite reverse;
    }
  `
};
