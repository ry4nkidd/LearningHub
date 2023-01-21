import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import ChannelPreview from './ChannelPreview'

vi.mock('react-i18next')
vi.mock('../../contexts/AuthContext')

describe('ChannelPreview', async () => {
  const { useTranslation }: { useTranslation: any } = await import(
    'react-i18next'
  )

  const { useAuth }: { useAuth: any } = await import(
    '../../contexts/AuthContext'
  )

  useTranslation.mockReturnValue({
    t: (key: string) => key
  })

  useAuth.mockReturnValue({ currentUser: { id: '1' } })

  test('Renders link to channel with avatar and name', () => {
    render(
      <ChannelPreview
        channel={{
          id: '1',
          created_at: '999',
          user1: {
            id: '1',
            created_at: '999',
            full_name: 'Test name 1',
            email: 'mail@test.com',
            avatar_url: 'https://test.com'
          },
          user2: {
            id: '2',
            created_at: '999',
            full_name: 'Test name 2',
            email: 'mail@test.com',
            avatar_url: 'https://test.com'
          }
        }}
      />
    )

    expect(screen.getByRole('link')).toBeTruthy()
    expect(screen.getByAltText('Test name 2 avatar')).toBeTruthy()
    expect(screen.getByText('Test name 2')).toBeTruthy()
    expect(screen.queryByText('mail@test.com')).toBeNull()
  })

  test("Renders email if name isn't provided", () => {
    render(
      <ChannelPreview
        channel={{
          id: '1',
          created_at: '999',
          user1: {
            id: '1',
            created_at: '999',
            email: 'mail@test2.com'
          },
          user2: {
            id: '2',
            created_at: '999',
            email: 'mail@test2.com'
          }
        }}
      />
    )
    expect(screen.getByText('mail@test2.com')).toBeTruthy()
  })

  test('Renders default avatar if no avatar url is provided', () => {
    render(
      <ChannelPreview
        channel={{
          id: '1',
          created_at: '999',
          user1: {
            id: '1',
            created_at: '999',
            full_name: 'Test name 3',
            email: ''
          },
          user2: {
            id: '2',
            created_at: '999',
            full_name: 'Test name 3',
            email: ''
          }
        }}
      />
    )
    expect(screen.queryByAltText('Test name 3 avatar')).toBeNull()
  })

  test('Renders own chat if both users are the current authenticated user', () => {
    render(
      <ChannelPreview
        channel={{
          id: '1',
          created_at: '999',
          user1: {
            id: '1',
            created_at: '999',
            full_name: 'Test name 3',
            email: ''
          },
          user2: {
            id: '1',
            created_at: '999',
            full_name: 'Test name 3',
            email: ''
          }
        }}
      />
    )
    expect(screen.getByText('channel-preview.own')).toBeTruthy()
  })
})
