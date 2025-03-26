'use client'

import {
	Driver,
	NewDriverParams,
	insertDriverParams
} from '@/lib/db/schema/drivers'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const DriverForm = ({
	driver,
	closeModal
}: {
	driver?: Driver
	closeModal?: () => void
}) => {
	const editing = !!driver?.id

	const router = useRouter()
	const utils = trpc.useContext()

	const form = useForm<z.infer<typeof insertDriverParams>>({
		// latest Zod release has introduced a TS error with zodResolver
		// open issue: https://github.com/colinhacks/zod/issues/2663
		// errors locally but not in production
		resolver: zodResolver(insertDriverParams),
		defaultValues: {
			name: driver?.name || '',
			surname: driver?.surname || '',
			idNumber: driver?.idNumber || '',
			dateOfBirth: driver?.dateOfBirth || '',
			mobileNr: driver?.mobileNr || '',
			physicalAddress: driver?.physicalAddress || '',
			postalAddress: driver?.postalAddress || '',
			email: driver?.email || '',
			licenseType: driver?.licenseType || '',
			lastRenewedDate: driver?.lastRenewedDate || '',
			licenseExpiry: driver?.licenseExpiry || '',
			vehicleRestriction: driver?.vehicleRestriction || 0,
			driverRestriction: driver?.driverRestriction || 0,
			image: driver?.image || '',
			handPrints: driver?.handPrints || '',
			comments: driver?.comments || '',
			active: driver?.active || false
		}
	})

	const onSuccess = async (
		action: 'create' | 'update' | 'delete',
		data?: { error?: string }
	) => {
		if (data?.error) {
			toast.error(data.error)
			return
		}

		await utils.drivers.getDrivers.invalidate()
		router.refresh()
		if (closeModal) closeModal()
		toast.success(`Driver ${action}d!`)
	}
	const onError = async (
		action: 'create' | 'update' | 'delete',
		data?: { error?: string }
	) => {
		if (data?.error) {
			toast.error(data.error)
			return
		}
	}

	const { mutate: createDriver, isLoading: isCreating } =
		trpc.drivers.createDriver.useMutation({
			onSuccess: (res) => onSuccess('create'),
			onError: (err) => onError('create', { error: err.message })
		})

	const { mutate: updateDriver, isLoading: isUpdating } =
		trpc.drivers.updateDriver.useMutation({
			onSuccess: (res) => onSuccess('update'),
			onError: (err) => onError('update', { error: err.message })
		})

	const { mutate: deleteDriver, isLoading: isDeleting } =
		trpc.drivers.deleteDriver.useMutation({
			onSuccess: (res) => onSuccess('delete'),
			onError: (err) => onError('delete', { error: err.message })
		})

	const handleSubmit = (values: NewDriverParams) => {
		if (editing) {
			updateDriver({ ...values, id: driver.id })
		} else {
			createDriver(values)
		}
	}
	return (
		<div className='max-h-screen overflow-auto my-4 custom-scrollbar'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className={'space-y-6 mb-8'}
				>
					{/* content goes here */}
					<div className='flex items-center'>
						<div className='flex-grow border-t border-gray-400'></div>
						<span className='mx-4 text-sm text-gray-600'>Personal Details</span>
						<div className='flex-grow border-t border-gray-400'></div>
					</div>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value || ''}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='surname'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Surname</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value || ''}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='idNumber'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Id Number</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value || ''}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='dateOfBirth'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Date Of Birth</FormLabel>
								<br />
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={'outline'}
												className={cn(
													'w-[240px] pl-3 text-left font-normal',
													!field.value && 'text-muted-foreground'
												)}
											>
												{field.value ? (
													format(new Date(field.value), 'PPP')
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent
										className='w-auto p-0'
										align='start'
									>
										<Calendar
											mode='single'
											selected={new Date(field.value)}
											onSelect={field.onChange}
											disabled={(date) =>
												date > new Date() || date < new Date('1900-01-01')
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='mobileNr'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Mobile Nr</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value || ''}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex items-center'>
						<div className='flex-grow border-t border-gray-400'></div>
						<span className='mx-4 text-sm text-gray-600'>Address Details</span>
						<div className='flex-grow border-t border-gray-400'></div>
					</div>
					<FormField
						control={form.control}
						name='physicalAddress'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Physical Address</FormLabel>
								<FormControl>
									<Input
										aria-rowspan={4}
										{...field}
										value={field.value || ''}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='postalAddress'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Postal Address</FormLabel>
								<FormControl>
									<Input
										aria-rowspan={4}
										{...field}
										value={field.value || ''}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex items-center'>
						<div className='flex-grow border-t border-gray-400'></div>
						<span className='mx-4 text-sm text-gray-600'>Contact Details</span>
						<div className='flex-grow border-t border-gray-400'></div>
					</div>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value || ''}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex items-center'>
						<div className='flex-grow border-t border-gray-400'></div>
						<span className='mx-4 text-sm text-gray-600'>License Details</span>
						<div className='flex-grow border-t border-gray-400'></div>
					</div>
					<FormField
						control={form.control}
						name='licenseType'
						render={({ field }) => (
							<FormItem>
								<FormLabel>License Type</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value || ''}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='lastRenewedDate'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last License Renewed Date</FormLabel>
								<br />
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={'outline'}
												className={cn(
													'w-[240px] pl-3 text-left font-normal',
													!field.value && 'text-muted-foreground'
												)}
											>
												{field.value ? (
													format(new Date(field.value), 'PPP')
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent
										className='w-auto p-0'
										align='start'
									>
										<Calendar
											mode='single'
											selected={new Date(field.value)}
											onSelect={field.onChange}
											disabled={(date) =>
												date > new Date() || date < new Date('1900-01-01')
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='licenseExpiry'
						render={({ field }) => (
							<FormItem>
								<FormLabel>License Expiry</FormLabel>
								<br />
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={'outline'}
												className={cn(
													'w-[240px] pl-3 text-left font-normal',
													!field.value && 'text-muted-foreground'
												)}
											>
												{field.value ? (
													format(new Date(field.value), 'PPP')
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent
										className='w-auto p-0'
										align='start'
									>
										<Calendar
											mode='single'
											selected={new Date(field.value)}
											onSelect={field.onChange}
											disabled={(date) => date < new Date()}
											initialFocus
										/>
									</PopoverContent>
								</Popover>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='vehicleRestriction'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Vehicle Restriction</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='driverRestriction'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Driver Restriction</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex items-center'>
						<div className='flex-grow border-t border-gray-400'></div>
						<span className='mx-4 text-sm text-gray-600'>Security Details</span>
						<div className='flex-grow border-t border-gray-400'></div>
					</div>
					<FormField
						control={form.control}
						name='image'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Image</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value || ''}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='handPrints'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Hand Prints</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value || ''}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex items-center'>
						<div className='flex-grow border-t border-gray-400'></div>
						<span className='mx-4 text-sm text-gray-600'>Comments</span>
						<div className='flex-grow border-t border-gray-400'></div>
					</div>
					<FormField
						control={form.control}
						name='comments'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Comments</FormLabel>
								<FormControl>
									<Input
										aria-rowspan={4}
										{...field}
										value={field.value || ''}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='active'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Active</FormLabel>
								<br />
								<FormControl>
									<Checkbox
										{...field}
										checked={!!field.value}
										onCheckedChange={field.onChange}
										value={''}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type='submit'
						className='mr-1'
						disabled={isCreating || isUpdating}
					>
						{editing
							? `Sav${isUpdating ? 'ing...' : 'e'}`
							: `Creat${isCreating ? 'ing...' : 'e'}`}
					</Button>
					{editing ? (
						<Button
							type='button'
							variant={'destructive'}
							onClick={() => deleteDriver({ id: driver.id })}
						>
							Delet{isDeleting ? 'ing...' : 'e'}
						</Button>
					) : null}
				</form>
			</Form>
		</div>
	)
}

export default DriverForm
