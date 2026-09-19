import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { InjectRepository } from '@nestjs/typeorm';
import { Participant } from '../participants/participant.entity';
import { Team } from '../teams/team.entity';
import { Track } from '../tracks/track.entity';
import { Contact } from '../contacts/contact.entity';
import { Schedule } from '../schedule/schedule.entity';
import { Hackathon } from '../hackathons/hackathon.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(Participant)
    private participantRepo: Repository<Participant>,

    @InjectRepository(Team)
    private teamRepo: Repository<Team>,

    @InjectRepository(Track)
    private trackRepo: Repository<Track>,

    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,

    @InjectRepository(Schedule)
    private scheduleRepo: Repository<Schedule>,

    @InjectRepository(Hackathon)
    private hackathonRepo: Repository<Hackathon>,
  ) {}

  // ===================== PARTICIPANTS =====================
  async importParticipants(file: any, hackathonId: number) {
    const hackathon = await this.hackathonRepo.findOne({
      where: { id: hackathonId },
    });

    if (!hackathon) throw new Error('Hackathon not found');

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const results: Participant[] = [];

    for (const row of data as any[]) {
      if (!row['Имя'] || !row['Фамилия']) continue;

      let team: Team | null = null;

      // обработка команды
      if (row['Команда']) {
        team = await this.teamRepo.findOne({
          where: {
            name: row['Команда'],
            hackathon: { id: hackathonId },
          },
        });

        // если команды не существует то создаём
        if (!team) {
          team = await this.teamRepo.save({
            name: row['Команда'],
            hackathon
          });
        }
      }

      // UPSERT участника по email если есть
      let participant: Participant | null = null;

      if (row['Эл. почта']) {
        participant = await this.participantRepo.findOne({
          where: {
            email: row['Эл. почта'],
            hackathon: { id: hackathonId },
          },
        });
      }

      if (!participant) {
        participant = this.participantRepo.create();
      }

      participant.lastName = row['Фамилия'];
      participant.firstName = row['Имя'];
      participant.middleName = row['Отчество'];
      participant.role = row['Роль'];
      participant.school = row['Уч.заведение'];
      participant.grade = row['Класс/курс'];
      participant.email = row['Эл. почта'];
      participant.phone = row['Контакты'];
      participant.team = team;
      participant.hackathon = hackathon;

      const saved = await this.participantRepo.save(participant);
      results.push(saved);
    }

    return {
      message: 'Participants imported',
      count: results.length,
    };
  }

  // ===================== TRACKS =====================
  async importTracks(file: any, hackathonId: number) {
    const hackathon = await this.hackathonRepo.findOne({
      where: { id: hackathonId },
    });

    if (!hackathon) throw new Error('Hackathon not found');

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const results: Track[] = [];

    for (const row of data as any[]) {
      if (!row['Название']) continue;

      // 🔍 ищем трек по name
      let track = await this.trackRepo.findOne({
        where: {
          name: row['Название'],
          hackathon: { id: hackathonId },
        },
      });

      // ➕ если нет — создаём
      if (!track) {
        track = this.trackRepo.create({
          name: row['Название'],
          hackathon,
        });
      }

      // 🔄 обновляем поля (в любом случае)
      track.description = row['Описание'];
      track.responsible = row['Ответственный'];

      const saved = await this.trackRepo.save(track);
      results.push(saved);
    }

    return {
      message: 'Tracks imported',
      count: results.length,
    };
  }

  // ===================== TEAMS =====================
  async importTeams(file: any, hackathonId: number) {
    const hackathon = await this.hackathonRepo.findOne({
      where: { id: hackathonId },
    });

    if (!hackathon) throw new Error('Hackathon not found');
    
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const results: Team[] = [];

    for (const row of data as any[]) {
      if (!row['Команда']) continue;

      let team = await this.teamRepo.findOne({
        where: {
          name: row['Команда'],
          hackathon: { id: hackathonId },
        },
      });

      if (!team) {
        team = this.teamRepo.create({
          name: row['Команда'],
          hackathon,
        });
      }

      // работа с треком (если есть колонка)
      let track: Track | null = null;

      if (row['Трек']) {
        track = await this.trackRepo.findOne({
          where: {
            name: row['Трек'],
            hackathon: { id: hackathonId },
          },
        });

        if (!track) {
          track = await this.trackRepo.save({
            name: row['Трек'],
            hackathon,
          });
        }
      }

      team.type = row['Тип'];
      team.projectName = row['Проект'];
      team.description = row['Описание'];
      team.folderLink = row['Ссылка папки'];
      team.designLink = row['Ссылка на работу дизайнера'];
      team.devLink = row['Ссылка на работу разработчика'];
      team.managerLink = row['Ссылка на работу менеджера'];
      team.track = track;

      const saved = await this.teamRepo.save(team);
      results.push(saved);
    }

    return {
      message: 'Teams imported',
      count: results.length,
    };
  }

  // ===================== CONTACTS =====================
  async importContacts(file: any, hackathonId: number) {
    const hackathon = await this.hackathonRepo.findOne({
      where: { id: hackathonId },
    });

    if (!hackathon) throw new Error('Hackathon not found');

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const results: any[] = [];

    for (const row of data as any[]) {
      if (!row['ФИО']) continue;

      let contact = await this.contactRepo.findOne({
        where: {
          email: row['Эл.почта'],
          hackathon: { id: hackathonId },
        },
      });

      if (!contact) {
        contact = this.contactRepo.create({
          email: row['Эл.почта'],
          hackathon,
        });
      }

      contact.fullName = row['ФИО'];
      contact.responsibleFor = row['Ответственен за'];
      contact.phone = row['Телефон'];
      contact.organization = row['Организация'];
      contact.position = row['Должность'];

      const saved = await this.contactRepo.save(contact);
      results.push(saved);
    }

    return {
      message: 'Contacts imported',
      count: results.length,
    };
  }

  // ===================== SCHEDULE =====================
  async importSchedule(file: any, hackathonId: number) {
    const hackathon = await this.hackathonRepo.findOne({
      where: { id: hackathonId },
    });

    if (!hackathon) throw new Error('Hackathon not found');

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const results: any[] = [];

    // обработка времени если в excel тип ячейки численный
    function excelTimeToString(value: any): string {
      if (typeof value === 'number') {
        const totalMinutes = Math.round(value * 24 * 60);
        const hours = Math.floor(totalMinutes / 60)
          .toString()
          .padStart(2, '0');
        const minutes = (totalMinutes % 60)
          .toString()
          .padStart(2, '0');

        return `${hours}:${minutes}`;
      }
      return String(value);
    }

    function normalizeDate(value: any): string {
      // ожидаем MM.DD
      if (typeof value === 'string') {
        const [month, day] = value.split('.');
        return `${month.padStart(2, '0')}.${day.padStart(2, '0')}`;
      }
      return String(value);
    }

    for (const row of data as any[]) {
      if (
        !row['Название'] ||
        !row['Дата'] ||
        !row['Время начала'] ||
        !row['Время конца']
      ) continue;

      let track: Track | null = null;
 
      //работа с треком
      if (row['Трек']) {
        track = await this.trackRepo.findOne({
          where: {
            name: row['Трек'],
            hackathon: { id: hackathonId },
          },
        });

        // если трека с таким названием не существует то создаём
        if (!track) {
          track = await this.trackRepo.save({
            name: row['Трек'],
            hackathon,
          });
        }
      }

      const schedule = this.scheduleRepo.create({
        title: row['Название'],
        date: normalizeDate(row['Дата']),
        startTime: excelTimeToString(row['Время начала']),
        endTime: excelTimeToString(row['Время конца']),
        objective: row['Задача'],
        track: track || undefined,
        hackathon,
      });

      const saved = await this.scheduleRepo.save(schedule);
      results.push(saved);
    }

    return {
      message: 'Schedule imported',
      count: results.length,
    };
  }

  // ================= EXPORT =================
  async exportAll(hackathonId: number) {
    const workbook = XLSX.utils.book_new();

    // SCHEDULE EXPORT
    const schedule = await this.scheduleRepo.find({
      where: { hackathon: { id: hackathonId } },
      relations: ['track'],
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    const scheduleData = schedule.map(s => ({
      'Название': s.title,
      'Дата': s.date,
      'Время начала': s.startTime,
      'Время конца': s.endTime,
      'Трек': s.track ? s.track.name : '',
      'Задача': s.objective,
    }));

    const scheduleSheet = XLSX.utils.json_to_sheet(scheduleData);
    XLSX.utils.book_append_sheet(workbook, scheduleSheet, 'Расписание');

    // CONTACTS EXPORT
    const contacts = await this.contactRepo.find({
      where: { hackathon: { id: hackathonId } },
    });

    const contactsData = contacts.map(u => ({
      'ФИО': u.fullName,
      'Эл.почта': u.email,
      'Ответственен за': u.responsibleFor,
      'Телефон': u.phone,
      'Организация': u.organization,
      'Должность': u.position,
    }));

    const usersSheet = XLSX.utils.json_to_sheet(contactsData);
    XLSX.utils.book_append_sheet(workbook, usersSheet, 'Контакты');

    // TRACKS EXPORT
    const tracks = await this.trackRepo.find({
      where: { hackathon: { id: hackathonId } },
    });

    const tracksData = tracks.map(t => ({
      'Название': t.name,
      'Описание': t.description,
      'Ответственный': t.responsible,
    }));

    const tracksSheet = XLSX.utils.json_to_sheet(tracksData);
    XLSX.utils.book_append_sheet(workbook, tracksSheet, 'Треки');

    // PARTICIPANTS EXPORT
    const participants = await this.participantRepo.find({
      relations: ['team'],
      where: { hackathon: { id: hackathonId } },
    });

    const participantsData = participants.map(p => ({
      'Фамилия': p.lastName,
      'Имя': p.firstName,
      'Отчество': p.middleName,
      'Команда': p.team ? p.team.name : '',
      'Роль': p.role,
      'Уч.заведение': p.school,
      'Класс/курс': p.grade,
      'Эл. почта': p.email,
      'Контакты': p.phone,
    }));

    const participantsSheet = XLSX.utils.json_to_sheet(participantsData);
    XLSX.utils.book_append_sheet(workbook, participantsSheet, 'Участники');

    // TEAMS EXPORT
    const teams = await this.teamRepo.find({
      where: { hackathon: { id: hackathonId } },
      relations: ['track'],
    });

    const teamsData = teams.map(t => ({
      'Команда': t.name,
      'Тип': t.type,
      'Проект': t.projectName,
      'Описание': t.description,
      'Ссылка папки': t.folderLink,
      'Ссылка на работу дизайнера': t.designLink,
      'Ссылка на работу разработчика': t.devLink,
      'Ссылка на работу менеджера': t.managerLink,
      'Трек': t.track ? t.track.name : '',
    }));

    const teamsSheet = XLSX.utils.json_to_sheet(teamsData);
    XLSX.utils.book_append_sheet(workbook, teamsSheet, 'Команды');

    // BUFFER
    const buffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    return buffer;
  }
}