const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// PostgreSQL 연결 세팅
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'borakim123',
//   port: 5432,
// });
const pool = new Pool({
  connectionString: 'postgresql://postgres:borakim123@db.xyagvzmqcbpymnlzyqkr.supabase.co:5432/postgres'
});

// API
// Department endpoints
app.get('/getDepartments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM department ORDER BY department_name');
    res.json(result.rows);
  } catch (err) {
    console.error('Department fetch error:', err.stack);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

app.post('/addDepartment', async (req, res) => {
  const { department_name } = req.body;
  if (!department_name) {
    return res.status(400).json({ error: 'Department name is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO department (department_name) VALUES ($1) RETURNING *',
      [department_name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Department add error:', err.stack);
    res.status(500).json({ error: 'Failed to add department' });
  }
});

app.delete('/deleteDepartment/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM department WHERE department_id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Department delete error:', err.stack);
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

app.put('/updateDepartments', async (req, res) => {
  const { departments } = req.body;
  if (!departments || !Array.isArray(departments)) {
    return res.status(400).json({ error: 'Invalid departments data' });
  }

  try {
    await pool.query('BEGIN');
    for (const dept of departments) {
      await pool.query(
        'UPDATE department SET department_name = $1 WHERE department_id = $2',
        [dept.department_name, dept.department_id]
      );
    }
    await pool.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Department update error:', err.stack);
    res.status(500).json({ error: 'Failed to update departments' });
  }
});

// Employee endpoints
app.get('/getEmployees', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, d.department_name 
      FROM employee e
      LEFT JOIN department d ON e.department_id = d.department_id
      ORDER BY e.name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Employee fetch error:', err.stack);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.post('/removeEmployeesFromDepartment', async (req, res) => {
  const { employeeIds } = req.body;
  if (!employeeIds || !Array.isArray(employeeIds)) {
    return res.status(400).json({ error: 'Invalid employee IDs' });
  }

  try {
    await pool.query('BEGIN');
    for (const id of employeeIds) {
      await pool.query(
        `UPDATE employee 
         SET department_id = NULL, departmentname = '없음', is_deleted = TRUE 
         WHERE employee_id = $1`,
        [id]
      );
    }
    await pool.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Employee remove error:', err.stack);
    res.status(500).json({ error: 'Failed to remove employees' });
  }
});

app.put('/updateEmployees', async (req, res) => {
  const { employees } = req.body;
  if (!employees || !Array.isArray(employees)) {
    return res.status(400).json({ error: 'Invalid employees data' });
  }

  try {
    await pool.query('BEGIN');
    for (const emp of employees) {
      await pool.query(
        `UPDATE employee SET 
          name = $1, 
          position = $2, 
          phone = $3, 
          is_department_head = $4
         WHERE employee_id = $5`,
        [emp.name, emp.position, emp.phone, emp.is_department_head, emp.employee_id]
      );
    }
    await pool.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Employee update error:', err.stack);
    res.status(500).json({ error: 'Failed to update employees' });
  }
});

// Note endpoints
app.post('/saveDepartmentNote', async (req, res) => {
  const { note } = req.body;
  try {
    // Implement your note saving logic here
    res.json({ success: true });
  } catch (err) {
    console.error('Note save error:', err.stack);
    res.status(500).json({ error: 'Failed to save note' });
  }
});

app.post('/saveEmployeeNote', async (req, res) => {
  const { note } = req.body;
  try {
    // Implement your note saving logic here
    res.json({ success: true });
  } catch (err) {
    console.error('Note save error:', err.stack);
    res.status(500).json({ error: 'Failed to save note' });
  }
});
//작업자
app.get('/getWorkerByDateRange', async (req, res) => {
  console.log('작업자 조회 요청:', req.query);

  const { fromDate, toDate } = req.query;

  if (!fromDate || !toDate) {
    console.error('필수 파라미터 누락');
    return res.status(400).json({ error: 'fromDate와 toDate가 필요합니다.' });
  }

  try {
    // 날짜 범위 조정 (시작일 00:00:00 ~ 종료일 23:59:59)
    const startDate = new Date(fromDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59, 999);

    console.log('조정된 날짜 범위:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    const query = `
      SELECT * FROM humanresourceset
      WHERE hireddate BETWEEN $1 AND $2
      ORDER BY hireddate DESC
    `;

    const result = await pool.query(query, [startDate, endDate]);
    console.log(`조회된 작업자 수: ${result.rowCount}`);
    res.json(result.rows);
  } catch (err) {
    console.error('작업자 조회 오류:', err.stack);
    res.status(500).json({ error: '작업자 정보 조회 중 오류 발생' });
  }
});

//파트너 조회

app.get('/getPartnerByDateRange', async (req, res) => {
  console.log('요청 받음:', req.query);
  
  const { fromDate, toDate } = req.query;

  if (!fromDate || !toDate) {
    console.error('필수 파라미터 누락');
    return res.status(400).json({ error: 'fromDate와 toDate가 필요합니다.' });
  }

  try {
    // 날짜 범위 조정 (시작일 00:00:00 ~ 종료일 23:59:59)
    const startDate = new Date(fromDate);
    startDate.setHours(0, 0, 0, 0); // 시작일 00:00:00으로 설정
    
    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59, 999); // 종료일 23:59:59.999로 설정

    console.log('조정된 날짜 범위:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    const query = `
      SELECT * FROM partnerset
      WHERE createdatetime BETWEEN $1 AND $2
      ORDER BY createdatetime DESC
    `;

    const result = await pool.query(query, [startDate, endDate]);
    console.log(`조회 결과: ${result.rowCount}건`);
    res.json(result.rows);
  } catch (err) {
    console.error('서버 오류:', err.stack);
    res.status(500).json({ error: '업체 정보 조회 중 오류 발생' });
  }
});


// 품번 또는 품명으로 productionorderset 조회

app.get('/searchItem', async (req, res) => {
  const { partno, partname } = req.query;

  try {
    let query = 'SELECT * FROM productset WHERE 1=1';
    const params = [];

    if (partno) {
      params.push(`%${partno}%`);
      query += ` AND partno ILIKE $${params.length}`;
    }

    if (partname) {
      params.push(`%${partname}%`);
      query += ` AND partname ILIKE $${params.length}`;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('조회 중 오류 발생');
  }
});
// 기존 코드에 추가할 부분

// equipmentjob 테이블 조회 (최신 상태 정보)
app.get('/getEquipmentJob', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM equipmentjob');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying equipmentjob table');
  }
});

// equipmentjobhistory 테이블 조회 (모든 기록)
app.get('/getEquipmentJobHistory', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM equipmentjobhistory ORDER BY event_time DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying equipmentjobhistory table');
  }
});
// equipmentjobhistory에 기록 추가
app.post('/insertEquipmentJobHistory', async (req, res) => {
  const { equipment_id, event_type, product_id, work_order, event_time } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO equipmentjobhistory 
       (equipment_id, event_type, product_id, work_order, event_time) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [equipment_id, event_type, product_id, work_order, event_time]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('equipmentjobhistory insert error:', err.stack);
    res.status(500).json({ error: 'Failed to insert equipment job history' });
  }
});

// equipmentjob 업데이트 (UPSERT 방식)
app.post('/updateEquipmentJob', async (req, res) => {
  const { equipment_id, event_type, product_id, work_order, event_time } = req.body;

  try {
    // 먼저 해당 equipment_id가 있는지 확인
    const checkResult = await pool.query(
      'SELECT * FROM equipmentjob WHERE equipment_id = $1',
      [equipment_id]
    );

    if (checkResult.rows.length > 0) {
      // 존재하면 UPDATE
      const updateResult = await pool.query(
        `UPDATE equipmentjob 
         SET event_type = $1, product_id = $2, work_order = $3, event_time = $4
         WHERE equipment_id = $5
         RETURNING *`,
        [event_type, product_id, work_order, event_time, equipment_id]
      );
      res.status(200).json(updateResult.rows[0]);
    } else {
      // 없으면 INSERT
      const insertResult = await pool.query(
        `INSERT INTO equipmentjob 
         (equipment_id, event_type, product_id, work_order, event_time) 
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [equipment_id, event_type, product_id, work_order, event_time]
      );
      res.status(200).json(insertResult.rows[0]);
    }
  } catch (err) {
    console.error('equipmentjob update error:', err.stack);
    res.status(500).json({ error: 'Failed to update equipment job' });
  }
});

app.get('/getProductionOrderSet', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productionorderset');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying database');
  }
});

app.get('/getCommonCode', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM commoncode');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying database');
  }
});

app.get('/getProduction', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM production');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying database');
  }
});

// status 업데이트
app.post('/updateStatus', async (req, res) => {
  const { orderno, status } = req.body;
  if (!orderno || !status){
    return res.status(400).send('error');
  }

  try {
    const newStatus = '진행';
    const result = await pool.query('SELECT * FROM productionorderset WHERE orderno = $1', [orderno]);
    if (result.rows.length > 0){
      await pool.query(
        'UPDATE productionorderset SET status = $1 WHERE orderno = $2',
        [newStatus, orderno]
      );
    }
    res.status(200).send('productionorder status 업데이트 완료');
  } catch (err) {
    console.error(err);
    res.status(500).send('업데이트 중 오류 발생');
  }
});

// 생산량 업데이트
app.post('/updateProduction', async (req, res) => {
  const { orderno, amount, time } = req.body;

  if (!orderno || !amount || !time) {
    return res.status(400).send('orderno, amount, time이 필요합니다.');
  }

  try {
    const now = new Date(time);

    // production 테이블 처리
    const result = await pool.query('SELECT * FROM production WHERE orderno = $1', [orderno]);
    if (result.rows.length > 0) {
      const existingTime = new Date(result.rows[0].time);
      const timeDiff = Math.abs(now - existingTime) / (1000 * 60);  // 분 단위로 차이 계산

      console.log(`Time Diff (minutes): ${timeDiff}`);  // 디버깅용 로그

      await pool.query(
        'UPDATE production SET amount = $1, time = $2 WHERE orderno = $3',
        [amount, time, orderno]
      );
    } else {
      const baseData = await pool.query(
        'SELECT * FROM work WHERE orderno = $1 ORDER BY time DESC LIMIT 1',
        [orderno]
      );

      if (baseData.rows.length === 0) {
        return res.status(404).send('work 테이블에 해당 orderno 데이터 없음');
      }

      const data = baseData.rows[0];
      await pool.query(
        `INSERT INTO production (
          time, companyname, plantno, plantname, orderarea,
          companyno, partno, partname, unit, amount, orderno
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          time, data.companyname, data.plantno, data.plantname, data.orderarea,
          data.companyno, data.partno, data.partname, data.unit,
          amount, orderno
        ]
      );
    }

    // work 테이블 처리
    const latestData = await pool.query(
      'SELECT * FROM work WHERE orderno = $1 ORDER BY time DESC LIMIT 1',
      [orderno]
    );

    if (latestData.rows.length === 0) {
      return res.status(404).send('work 테이블에 해당 orderno 데이터 없음');
    }

    const insertData = latestData.rows[0];

    if (Math.abs(now - new Date(insertData.time)) / (1000 * 60) < 1) {
      // 최신 work 데이터가 1분 이내면 UPDATE
      await pool.query(
        `UPDATE work SET 
          amount = $1, time = $2 
         WHERE orderno = $3 AND time = $4`,
        [amount, time, orderno, insertData.time]
      );
    } else {
      // 아니면 INSERT
      await pool.query(
        `INSERT INTO work (
          time, companyname, plantno, plantname, orderarea, 
          companyno, partno, partname, unit, amount, orderno
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          time, insertData.companyname, insertData.plantno, insertData.plantname, insertData.orderarea,
          insertData.companyno, insertData.partno, insertData.partname, insertData.unit,
          amount, orderno
        ]
      );
    }

    res.status(200).send('production 및 work 테이블 업데이트 완료');
  } catch (err) {
    console.error(err);
    res.status(500).send('업데이트 중 오류 발생');
  }
});

// Fetch current inventory
app.get('/getCurrentInventory', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM currentinventory ORDER BY lastupdated DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Current inventory fetch error:', err.stack);
    res.status(500).json({ error: 'Failed to fetch current inventory' });
  }
});

// 서버 시작
// app.listen(port, '0.0.0.0', () => {
//   console.log(`Server Running: http://0.0.0.0:${port}`);
// });
app.listen(port, () => {
  console.log(`Server Running: ${port}`);
});
