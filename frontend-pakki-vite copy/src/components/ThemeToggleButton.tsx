import React from 'react';
import { Button, useColorMode } from '@chakra-ui/react';

const ThemeToggleButton: React.FC = () => {
    const { toggleColorMode } = useColorMode();

    return (
        <Button colorScheme='brand' onClick={toggleColorMode}>
            🌙
        </Button>
    );
};

export default ThemeToggleButton;
