import {
  parseInputData,
  createTheme,
  getDayArray,
  getRowAndColumnIndexFromDate,
  getDateTooltip,
  parseDateFromDateString,
} from '../../utils'
import Cell from '../Cell'
import Label from '../Label'
import './index.css'

interface TableBodyProps {
  data: InputData[]
  start: string
  end: string
  textColor: string
  startsOnSunday: boolean
  includeBoundary: boolean
  cx: number
  cy: number
  cr: number
  theme: string | ThemeProps
  onClick: MouseEventHandler
}

export default function TableBody({
  data,
  start,
  end,
  textColor,
  startsOnSunday,
  includeBoundary,
  cx,
  cy,
  cr,
  theme,
  onClick,
}: TableBodyProps) {
  const { year: startYear, day: startDay } = parseDateFromDateString(start)
  const { day: endDay } = parseDateFromDateString(end)

  const { row: startRow, col: startCol } = getRowAndColumnIndexFromDate(startYear, start, startsOnSunday)
  const { row: endRow, col: endCol } = getRowAndColumnIndexFromDate(startYear, end, startsOnSunday)

  const DATES = startsOnSunday
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const dayArray = getDayArray(start, end, startsOnSunday)

  const setColorByTheme = (inputTheme: string | ThemeProps) => {
    return createTheme(inputTheme)
  }

  const themeProps = setColorByTheme(theme)
  const parsedData = parseInputData(data)

  const isOutRangedCell = (_: number, colIndex: number): boolean => {
    return colIndex < startCol || colIndex > endCol
  }

  const isBoundaryCell = (rowIndex: number, colIndex: number): boolean => {
    return (colIndex === startCol && rowIndex < startRow) || (colIndex === endCol && rowIndex > endRow)
  }

  const isWithin7Days = (): boolean => {
    return startCol === endCol || endDay - startDay <= 7
  }

  return (
    <tbody>
      {DATES.map((date, rowIndex) => (
        <tr key={date}>
          <Label tabIndex={0} textColor={textColor} style={{ textAlign: 'right', fontSize: cy, lineHeight: 0 }}>
            {date}
          </Label>
          {dayArray[rowIndex].map((day, colIndex) => {
            if (endCol === 0 && colIndex === 1) {
              return (
                <td
                  key={colIndex}
                  style={{
                    padding: 0,
                    width: isWithin7Days() ? cx : 0,
                    height: isWithin7Days() ? cy : 0,
                    outline: 'none',
                    borderRadius: cr,
                    outlineOffset: '-1px',
                    shapeRendering: 'geometricPrecision',
                  }}
                />
              )
            }

            if (isOutRangedCell(rowIndex, colIndex)) {
              return <td style={{ padding: '0', display: 'none' }} key={colIndex}></td>
            }

            if (isBoundaryCell(rowIndex, colIndex)) {
              return (
                <td
                  key={colIndex}
                  style={{
                    padding: 0,
                    width: isWithin7Days() ? cx : 0,
                    height: isWithin7Days() ? cy : 0,
                    outline: includeBoundary ? `1px solid ${themeProps.level0}` : 'none',
                    borderRadius: cr,
                    outlineOffset: '-1px',
                    shapeRendering: 'geometricPrecision',
                  }}
                />
              )
            }

            const data = parsedData.get(day)
            const dateTooltip = getDateTooltip(day)

            const handleClick = (e: TableCellMouseEvent) => {
              const cellData: CellData = {
                date: day,
                data: data?.data,
              }

              if (onClick) {
                onClick(e, cellData)
              }
            }

            return (
              <Cell
                key={colIndex}
                tabIndex={-1}
                style={{ width: cx, height: cy, borderRadius: cr }}
                dataLevel={data !== undefined ? data.level : 0}
                data-content={JSON.stringify(data?.data)}
                dataTooltip={dateTooltip}
                tooltipSize={cy}
                theme={theme}
                themeProps={themeProps}
                onClick={handleClick}
              />
            )
          })}
        </tr>
      ))}
    </tbody>
  )
}
