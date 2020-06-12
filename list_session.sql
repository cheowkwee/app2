
select * from karely_user_session order by user_id;

select now() + interval '1 day';
select * from karely_user_session where expired_on < (now() + interval '1 day')  order by user_id;
