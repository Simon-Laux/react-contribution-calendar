// Type definitions for react-contribution-calendar 0.0.36
// Project: https://github.com/seiwon-yaehee/react-contribution-calendar
// Definitions by: Seiwon Park <https://github.com/SeiwonPark>
//                 Yaehee Choe <https://github.com/YaeheeChoe>

/// <reference path="./types.d.ts" />

declare module 'react-contribution-calendar' {
  import { FunctionComponent } from 'react'
  export const createTheme = (themeProps: ThemeProps): ThemeProps => {}
  /**
   * This is for attributes of <ContributionCalendar /> function component.
   */
  export interface ContributionCalendarProps {
    /**
     * List of items in the data, defaults to an empty list `[]`.
     */
    data: InputData[]
    /**
     * The name of theme for the ContributionCalendar, defaults to `grass`. Also
     * `ThemeProps` could be added directly i.e. when trying to use custom theme.
     */
    theme?: string | ThemeProps
  }

  export const ContributionCalendar: FunctionComponent<ContributionCalendarProps>
}
