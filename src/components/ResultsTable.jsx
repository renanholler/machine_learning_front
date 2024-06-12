import React from 'react';
import { useTable } from 'react-table';

const ResultsTable = ({ data }) => {
  const classColumns = React.useMemo(
    () => [
      {
        Header: 'Class',
        accessor: 'class'
      },
      {
        Header: 'Precision',
        accessor: 'precision'
      },
      {
        Header: 'Recall',
        accessor: 'recall'
      },
      {
        Header: 'F1-Score',
        accessor: 'f1-score'
      },
      {
        Header: 'Support',
        accessor: 'support'
      }
    ],
    []
  );

  const avgColumns = React.useMemo(
    () => [
      {
        Header: 'Metric',
        accessor: 'metric'
      },
      {
        Header: 'Precision',
        accessor: 'precision'
      },
      {
        Header: 'Recall',
        accessor: 'recall'
      },
      {
        Header: 'F1-Score',
        accessor: 'f1-score'
      },
      {
        Header: 'Support',
        accessor: 'support'
      }
    ],
    []
  );

  const classData = React.useMemo(() => {
    if (!data['macro avg']) return [];
    return Object.keys(data)
      .filter(key => key !== 'accuracy' && key !== 'macro avg' && key !== 'weighted avg')
      .map(key => ({
        class: key,
        precision: data[key].precision,
        recall: data[key].recall,
        'f1-score': data[key]['f1-score'],
        support: data[key].support
      }));
  }, [data]);

  const avgData = React.useMemo(() => {
    if (!data['macro avg']) return [];
    return [
      {
        metric: 'accuracy',
        precision: '',
        recall: '',
        'f1-score': data.accuracy,
        support: data['macro avg'].support
      },
      {
        metric: 'macro avg',
        precision: data['macro avg'].precision,
        recall: data['macro avg'].recall,
        'f1-score': data['macro avg']['f1-score'],
        support: data['macro avg'].support
      },
      {
        metric: 'weighted avg',
        precision: data['weighted avg'].precision,
        recall: data['weighted avg'].recall,
        'f1-score': data['weighted avg']['f1-score'],
        support: data['weighted avg'].support
      }
    ];
  }, [data]);

  const RenderTable = ({ columns, data }) => {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow
    } = useTable({ columns, data });

    return (
      <table style={{ border: 'solid 1px blue', marginTop: '20px' }} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, headerGroupIndex) => {
            const headerGroupProps = headerGroup.getHeaderGroupProps();
            return (
              <tr key={headerGroupIndex} role={headerGroupProps.role} style={headerGroupProps.style}>
                {headerGroup.headers.map((column, columnIndex) => {
                  const columnProps = column.getHeaderProps();
                  return (
                    <th key={columnIndex} role={columnProps.role} style={{ border: 'solid 1px gray', padding: '10px' }}>
                      {column.render('Header')}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            const rowProps = row.getRowProps();
            return (
              <tr key={rowIndex} role={rowProps.role} style={rowProps.style}>
                {row.cells.map((cell, cellIndex) => {
                  const cellProps = cell.getCellProps();
                  return (
                    <td key={cellIndex} role={cellProps.role} style={{ border: 'solid 1px gray', padding: '10px' }}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      {data['macro avg'] && (
        <>
          <RenderTable columns={classColumns} data={classData} />
          <h2>Average and Accuracy Results</h2>
          <RenderTable columns={avgColumns} data={avgData} />
        </>
      )}
      {data.clusters && (
        <div className='image-container'>
          {data.plot_2d && <img src={`data:image/png;base64,${data.plot_2d}`} alt="2D Plot" />}
          {data.plot_3d && <img src={`data:image/png;base64,${data.plot_3d}`} alt="3D Plot" />}
        </div>
      )}
    </div>
  );
};

export default ResultsTable;