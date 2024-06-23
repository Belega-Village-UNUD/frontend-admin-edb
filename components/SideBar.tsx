'use client'

import UserStore from '@/components/nav/UserStore'
import { Dialog, Disclosure, DisclosureButton, DisclosurePanel, Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {
  Bars3Icon,
  ChartPieIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  HomeModernIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { ShoppingBag, StoreIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useState } from 'react'


const teams = [
  { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
  { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
  { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
]

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

type navigationType = {
  main: any
}

const SideBar: React.FC<navigationType> = ({ main }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/Dashboard', icon: HomeModernIcon },
    {
      name: 'Store',
      href: '#',
      icon: StoreIcon,
      children: [
        { name: 'All Store', href: '/Dashboard/store' },
        { name: 'Confirmation Store', href: '/Dashboard/store/confirm' },
        { name: 'Declined Store', href: '/Dashboard/store/cancel' },
      ]
    },
    {
      name: 'Fee',
      href: '#',
      icon: ShoppingBag,
      children: [
        { name: 'All Fee', href: '/Dashboard/fee' },
        { name: 'Create New Fee', href: '/Dashboard/fee/new' }
      ]
    },
    {
      name: 'Transaction',
      href: '/store/transaction',
      icon: ClipboardDocumentCheckIcon,
      children: [
        { name: 'My Transaction', href: '/store/transaction' },
        { name: 'Cancellation', href: '/store/transaction/cancellation' }
      ]
    },
    {
      name: 'Store',
      href: '#',
      icon: StoreIcon,
      children: [
        { name: 'Store Profile', href: '/store/profile' },
        { name: 'Store Decoration', href: '/store/store/new' }
      ]
    },
    {
      name: 'Documents', href: '#', icon: DocumentDuplicateIcon
    },
    {
      name: 'Reports', href: '#', icon: ChartPieIcon
    },
  ]

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center mt-4">
                      <Link href="/" className='relative rounded-full overflow-hidden '>
                        <Image src="/logo.png" alt='' width={50} height={50} className='object-contain transform scale-125' />
                      </Link>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => {
                              const splitPath = pathname.split('/').join('/');
                              const isActive = splitPath === item.href;
                              return (
                                <li key={item.name}>
                                  <Link href={item.href} key={item.name} className={classNames(
                                    isActive
                                      ? 'bg-green-100 text-green-700'
                                      : 'text-gray-700 hover:text-green-700 hover:bg-green-100',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}>
                                    <item.icon
                                      className={classNames(
                                        isActive ? 'text-green-700' : 'text-gray-400 group-hover:text-green-700',
                                        'h-6 w-6 shrink-0'
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        </li>
                        <li>
                          <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {teams.map((team) => (
                              <li key={team.name}>
                                <Link
                                  href={team.href}
                                  className={classNames(
                                    team.current
                                      ? 'bg-green-100 text-green-700'
                                      : 'text-gray-700 hover:text-green-700 hover:bg-green-100',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <span
                                    className={classNames(
                                      team.current
                                        ? 'text-green-700 border-indigo-600'
                                        : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-green-700',
                                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                                    )}
                                  >
                                    {team.initial}
                                  </span>
                                  <span className="truncate">{team.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="mt-auto">
                          <Link
                            href="#"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-green-100 hover:text-green-700"
                          >
                            <Cog6ToothIcon
                              className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-green-700"
                              aria-hidden="true"
                            />
                            Settings
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">

          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center mt-4">
              <Link href="#" className='relative rounded-full overflow-hidden '>
                <Image src="/logo.png" alt='' width={50} height={50} className='object-contain transform scale-125' />
              </Link>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                      return (
                        <li key={item.name}>
                          {!item.children ? (
                            <Link href={item.href} key={item.name} className={classNames(
                              pathname.endsWith(item.href)
                                ? 'bg-green-100 text-green-700'
                                : 'text-gray-700 hover:text-green-700 hover:bg-green-100',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                            )}>
                              <item.icon
                                className={classNames(
                                  pathname.endsWith(item.href) ? 'text-green-700' : 'text-gray-400 group-hover:text-green-700',
                                  'h-6 w-6 shrink-0'
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </Link>
                          ) : (
                            <Disclosure as="div" defaultOpen={true}>
                              {({ open }) => (
                                <>
                                  <DisclosureButton
                                    className={classNames(
                                      pathname.endsWith(item.href) ? 'bg-gray-50' : 'hover:bg-gray-50',
                                      'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700'
                                    )}
                                  >
                                    <item.icon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                                    {item.name}
                                    <ChevronRightIcon
                                      className={classNames(
                                        open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                                        'ml-auto h-5 w-5 shrink-0'
                                      )}
                                      aria-hidden="true"
                                    />
                                  </DisclosureButton>
                                  <DisclosurePanel as="ul" className="mt-1">
                                    {item.children.map((subItem) => {
                                      return (
                                        <li key={subItem.name}>
                                          <Link
                                            href={subItem.href}
                                            key={subItem.name}
                                            className={classNames(
                                              pathname.endsWith(subItem.href)
                                                ? 'bg-green-100 text-green-700'
                                                : 'text-gray-700 hover:text-green-700 hover:bg-green-100',
                                              'group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6'
                                            )}
                                          >
                                            <div
                                              className={classNames(
                                                pathname.endsWith(subItem.href) ? 'text-green-700' : 'text-gray-400 group-hover:text-green-700',
                                                'h-6 w-6 shrink-0'
                                              )}
                                              aria-hidden="true"
                                            ></div>
                                            {subItem.name}
                                          </Link>
                                        </li>
                                      )
                                    })}
                                  </DisclosurePanel>
                                </>
                              )}
                            </Disclosure>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <Link
                          href={team.href}
                          className={classNames(
                            team.current
                              ? 'bg-green-100 text-green-700'
                              : 'text-gray-700 hover:text-green-700 hover:bg-green-100',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <span
                            className={classNames(
                              team.current
                                ? 'text-green-700 border-indigo-600'
                                : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-green-700',
                              'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                            )}
                          >
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <Link
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-green-100 hover:text-green-700"
                  >
                    <Cog6ToothIcon
                      className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-green-700"
                      aria-hidden="true"
                    />
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div >

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form className="relative flex flex-1 " action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="block h-full w-full border-0 py-0 pl-8 pr-0 bg-white  text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  type="search"
                  name="search"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <UserStore />
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-5">
            <div className="px-4 sm:px-6 lg:px-8">{main}</div>
          </main>
        </div>
      </div >
    </>
  )
}

export default SideBar;