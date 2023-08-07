import {
	Box,
	Stack,
	Popover,
	PopoverTrigger,
	useColorModeValue,
} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'
import { NAV_ITEMS } from './NavItem';

const DesktopNav = () => {
	const linkColor = useColorModeValue('gray.600', 'gray.200')
	const linkHoverColor = useColorModeValue('gray.800', 'white')

	return (
		<Stack direction={'row'} spacing={4}>
			{NAV_ITEMS.map((navItem) => (
				<Box key={navItem.label}>
					<Popover trigger={'hover'} placement={'bottom-start'}>
						<PopoverTrigger>
							<Box
								as="a"
								p={2}
								href={navItem.href ?? '#'}
								fontSize={'sm'}
								fontWeight={500}
								color={linkColor}
								_hover={{
									textDecoration: 'none',
									color: linkHoverColor,
								}}>
								<ChakraLink as={ReactRouterLink} to={navItem.href} fontSize={"large"}>
									{navItem.label}
								</ChakraLink>
							</Box>
						</PopoverTrigger>
					</Popover>
				</Box>
			))}
		</Stack>
	)
}

export default DesktopNav